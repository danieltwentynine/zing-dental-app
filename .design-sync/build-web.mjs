// Builds Zing's React Native components into a browser package for /design-sync.
// The converter needs a built dist + .d.ts tree; the app has neither, so this
// emits one to .design-sync/.cache/web-pkg/ (react-native -> react-native-web,
// NativeWind JSX runtime, Tailwind CSS, fonts, token CSS vars).
// Run from the repo root after staging .ds-sync/: node .design-sync/build-web.mjs
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, '.design-sync/.cache/web-pkg');
const DIST = join(OUT, 'dist');
const esbuild = createRequire(join(ROOT, '.ds-sync/package.json'))('esbuild');

// Native-only (camera) - can't render in a browser.
const EXCLUDE = new Set(['CameraBackdrop', 'CameraGate']);
const componentFiles = readdirSync(join(ROOT, 'components'), { recursive: true })
  .filter((p) => p.endsWith('.tsx') && !EXCLUDE.has(p.split('/').pop().replace('.tsx', '')))
  .sort();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(DIST, 'fonts'), { recursive: true });

const shared = {
  bundle: true, platform: 'browser', absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
  jsx: 'automatic', jsxImportSource: 'nativewind', tsconfig: join(ROOT, 'tsconfig.json'),
  alias: { 'react-native': 'react-native-web' },
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.jsx', '.json'],
  loader: { '.js': 'jsx' },
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"production"', global: 'globalThis' },
  logLevel: 'error',
};

// 1. JS: one ESM file, React left external so the converter supplies it.
// Bundled CJS deps (react-native-web etc.) call require('react'), which ESM
// output can't satisfy - the banner hands them the imported modules instead.
const EXTERNAL = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'];
const banner = EXTERNAL.map((m, i) => `import * as __ext${i} from '${m}';`).join('\n') +
  `\nvar require = (n) => { const m = { ${EXTERNAL.map((m, i) => `'${m}': __ext${i}`).join(', ')} }[n];` +
  ` if (!m) throw new Error('zing-ds: unexpected require ' + n); return m.default ?? m; };` +
  // The design project's hand-built ui_kits/ read the old bundle's global name; the
  // converter normalizes underscores away, so alias it to window.ZingDS here.
  `\nif (!('ZingDesignSystem_f62470' in globalThis)) Object.defineProperty(globalThis, 'ZingDesignSystem_f62470', { get: () => globalThis.ZingDS, configurable: true });`;
// SafeScreen reads safe-area insets, so designs need its provider too.
const PROVIDER_EXPORT = "export { SafeAreaProvider } from 'react-native-safe-area-context';";
const entry = [...componentFiles.map((p) => `export * from './components/${p.replace('.tsx', '')}';`), PROVIDER_EXPORT].join('\n');
await esbuild.build({
  ...shared, format: 'esm', outfile: join(DIST, 'index.js'), banner: { js: banner },
  stdin: { contents: entry, resolveDir: ROOT, loader: 'ts' },
  external: EXTERNAL,
});

// 2. Types: tsc declarations, with @/ aliases rewritten to relative paths.
writeFileSync(join(OUT, 'tsconfig.json'), JSON.stringify({
  extends: '../../../tsconfig.json',
  compilerOptions: { declaration: true, emitDeclarationOnly: true, noEmit: false, rootDir: '../../..', outDir: 'dist' },
  files: ['../../../nativewind-env.d.ts', ...componentFiles.map((p) => `../../../components/${p}`)],
}));
execFileSync(join(ROOT, 'node_modules/.bin/tsc'), ['-p', join(OUT, 'tsconfig.json')], { stdio: 'inherit' });
for (const f of readdirSync(DIST, { recursive: true }).filter((p) => p.endsWith('.d.ts'))) {
  const file = join(DIST, f);
  const toRel = (_, p) => {
    const rel = relative(dirname(file), join(DIST, p));
    return `from '${rel.startsWith('.') ? rel : `./${rel}`}'`;
  };
  writeFileSync(file, readFileSync(file, 'utf8').replace(/from '@\/([^']+)'/g, toRel).replace(/import\("@\/([^"]+)"\)/g, (m, p) => toRel(m, p).replace(/^from '(.*)'$/, 'import("$1")')));
}
writeFileSync(join(DIST, 'index.d.ts'), entry + '\n');

// 3. CSS: Tailwind (NativeWind preset) for className-styled components.
execFileSync(join(ROOT, 'node_modules/.bin/tailwindcss'), ['-i', 'global.css', '-c', 'tailwind.config.js', '-o', join(DIST, 'styles.css')], { stdio: 'inherit' });

// 4. Fonts: the PostScript-named families the components reference.
const FONTS = {
  'baloo-2': ['500Medium', '600SemiBold', '700Bold', '800ExtraBold'],
  'space-grotesk': ['700Bold'],
  nunito: ['800ExtraBold'],
};
const FAMILY = { 'baloo-2': 'Baloo 2', 'space-grotesk': 'Space Grotesk' };
const faces = [];
for (const [pkg, weights] of Object.entries(FONTS)) {
  for (const w of weights) {
    const dir = join(ROOT, 'node_modules/@expo-google-fonts', pkg, w);
    const ttf = readdirSync(dir).find((n) => n.endsWith('.ttf'));
    copyFileSync(join(dir, ttf), join(DIST, 'fonts', ttf));
    faces.push(`@font-face { font-family: '${ttf.replace('.ttf', '')}'; src: url('./${ttf}') format('truetype'); font-display: block; }`);
    // Also as a weighted family ('Baloo 2', 'Space Grotesk') so CSS font-weight works in hand-written glue.
    if (pkg !== 'nunito') faces.push(`@font-face { font-family: '${FAMILY[pkg]}'; font-weight: ${parseInt(w)}; src: url('./${ttf}') format('truetype'); font-display: block; }`);
  }
}
writeFileSync(join(DIST, 'fonts', 'fonts.css'), faces.join('\n') + '\n');

// 5. Tokens: lib/tokens.ts as custom properties. Un-prefixed names match the
// design project's hand-built pages (guidelines/, ui_kits/), which read them.
const { outputFiles } = await esbuild.build({ ...shared, entryPoints: ['lib/tokens.ts'], format: 'esm', write: false, platform: 'node' });
const t = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const vars = [];
for (const [ramp, v] of Object.entries(t.palette)) {
  if (typeof v === 'string') vars.push(`--${ramp}: ${v};`);
  else for (const [step, hex] of Object.entries(v)) vars.push(`--${ramp}-${step}: ${hex};`);
}
for (const [k, v] of Object.entries(t.tokens)) vars.push(`--${kebab(k)}: ${v};`);
for (const [k, v] of Object.entries(t.radius)) vars.push(`--radius-${k}: ${v}px;`);
// Appended to styles.css: the converter only copies token files from a tokens package.
// web-tokens.css adds the web-only vocabulary (spacing, shadows, type scale, motion) with no app source.
writeFileSync(join(DIST, 'styles.css'), `/* Tokens generated from lib/tokens.ts */\n:root {\n  ${vars.join('\n  ')}\n}\n\n` +
  readFileSync(join(ROOT, '.design-sync/web-tokens.css'), 'utf8') + '\n' + readFileSync(join(DIST, 'styles.css'), 'utf8'));

writeFileSync(join(OUT, 'package.json'), JSON.stringify({ name: 'zing-ds', private: true, module: 'dist/index.js', types: 'dist/index.d.ts' }, null, 2));
console.log(`web-pkg: ${componentFiles.length} component files -> ${relative(ROOT, OUT)}`);
