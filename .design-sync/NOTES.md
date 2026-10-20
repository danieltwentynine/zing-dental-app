# design-sync notes

## Target project
- Target is the pre-existing hand-built "Zing Design System" project (re-adopted on the user's explicit ask, 2026-10-20). It is NOT sync-owned outside the synced folders.
- NEVER delete `guidelines/**` (18 hand-made pages) or anything outside the synced folders (`assets/`, `ui_kits/`, `templates/`, root `*.html` canvases, `uploads/`, `screenshots/`, `SKILL.md`, `_adherence.oxlintrc.json`). User chose "Sync, keep guidelines/".
- Those hand-built pages depend on sync output: `guidelines/*.html` and `ui_kits/app/` link `../styles.css` and read UN-prefixed vars (`--mint-500`, `--surface-card`, `--font-display`, `--shadow-mint`, `--space-*`…); `ui_kits/app/*.jsx` read components from `window.ZingDesignSystem_f62470` (the old hand bundle's global) under React 18 UMD. Keep both contracts:
  - token names stay un-prefixed (`build-web.mjs` step 5 + `.design-sync/web-tokens.css`);
  - the `ZingDesignSystem_f62470` getter alias in the `build-web.mjs` banner (the converter strips `_` from `globalName`, so it can't be set via config).
  Verified 2026-10-20 with a React-18 harness reproducing the kit's usage. `templates/app-screen/` is self-contained (own `ds-base.js`) and unaffected.
- The first sync deleted the old hand-written `components/<group>/*.{jsx,d.ts,prompt.md}` + `*.card.html` and the superseded `tokens/*.css` (their colors/radii live in `lib/tokens.ts`, the rest moved into `web-tokens.css`; their Nunito/Nunito Sans fonts predated the Baloo 2 decision).

## Build
- No Storybook in this repo (searched 2026-10-20) -> package shape. The app has no web dist, so `buildCmd` = `node .design-sync/build-web.mjs` builds one into `.design-sync/.cache/web-pkg/` (gitignored): esbuild with `react-native` -> `react-native-web`, NativeWind `jsxImportSource`, `.web.*` extensions first; `tsc` declarations with `@/` rewritten to relative paths; Tailwind CSS; fonts from `@expo-google-fonts`; tokens from `lib/tokens.ts`.
- Run order (repo root, after staging `.ds-sync/`): `node .design-sync/build-web.mjs`, then the driver with `--entry ./.design-sync/.cache/web-pkg/dist/index.js --node-modules ./node_modules`.
- `build-web.mjs` needs `.ds-sync/node_modules/esbuild` (staged converter deps), so stage first.
- React stays external in the web dist; bundled CJS deps call `require('react' | 'react-dom' | 'react-dom/client' | 'react/jsx-runtime')`, which the banner's local `require` satisfies. A new "zing-ds: unexpected require X" pageerror means a dep needs X added to `EXTERNAL`.
- `tokensGlob` only works with a `tokensPkg` in node_modules, so tokens are prepended to the `cssEntry` stylesheet instead.
- `CameraBackdrop`/`CameraGate` are excluded (vision-camera is native-only); the list lives in `EXCLUDE` in `build-web.mjs`. New `components/**/*.tsx` files are picked up automatically.
- `SafeAreaProvider` is re-exported from the bundle and set as `cfg.provider` (SafeScreen throws without it); it's excluded as a card via `componentSrcMap: null`.
- `ui/` is a generic dir name to the converter, so those components group as `general`. Accepted; regrouping would need docsMap stubs.
- No playwright browser is cached; the render check and capture use the installed Google Chrome: `DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` (playwright npm installed with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`).

## Known render warns
- `[RENDER_THIN]` ZingMascot: pure-SVG mascot with no text; the review sheet shows it rendering correctly. Benign.

## Re-sync risks
- `web-tokens.css` is a hand-carried copy of the old project's spacing, type scale, shadows and motion. It has no app source, so it won't track any change to how the app spaces or shadows things. Edit it deliberately.
- Previews hard-code copy and prop values from `app/` screens as of 2026-10-20 (coach messages from `lib/coach.ts`, Button labels). If props are renamed, the preview `.tsx` files fail to compile and that card drops to the floor card; watch the build log for `! preview build failed`.
- The ui_kit compatibility (global alias + un-prefixed vars) is only verified by the harness noted above, not by the render check. Spot-check `ui_kits/app/index.html` in the project after any change to the banner or token names.
- `react-native-web` must stay installed; it's a direct dependency only because Expo web templates add it.
