# Runbook

## Checks (run before every commit; CI runs the same)
```bash
npm ci                                   # clean install
npx tsc --noEmit                         # typecheck (strict)
for f in lib/*.check.mjs; do node "$f"; done
TZ=America/New_York node lib/streak.check.mjs   # exercises the DST boundary cases
```
There is no unit-test framework or linter by design for now (see `lib/streak.check.mjs`). New pure logic goes in `lib/` with a sibling `*.check.mjs`.

## Expo version
`package.json` is the authority (currently SDK 57). Before using any Expo API, read the docs for the **installed** SDK version (see `AGENTS.md`). Upgrade by SDK, not by package: `npx expo install expo@latest --fix`, then the checks above and `npx expo export --platform ios --output-dir <tmp>`. Stay on the SDK-pinned versions of react, react-native, reanimated, screens, etc.; don't bump them individually.

## Local run
```bash
npx expo start      # press i for the iOS simulator
```
Native modules (Google Sign-In, dev client) need a development build, not Expo Go.

## Release
See `.claude/skills/release-testflight/SKILL.md`.

## Common failures
- `EALLOWSCRIPTS` from `npx expo install` — see the comment in `.npmrc`; add script allowances to `package.json` `allowScripts`.
- Firebase Auth typing errors — `types/firebase-auth.d.ts` augments the module; don't use `@ts-ignore`.

_Add a line here whenever a failure costs more than 15 minutes._
