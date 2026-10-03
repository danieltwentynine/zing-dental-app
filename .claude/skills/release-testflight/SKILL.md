---
name: release-testflight
description: Checklist for cutting an iOS build with EAS and submitting to TestFlight. Use when asked to release, ship, or build for iOS.
---

# Release to TestFlight

Never run `eas build` or `eas submit` without the user's explicit go-ahead: builds consume the limited free-tier quota (see `CLAUDE.md`) and submissions are outward-facing.

1. Working tree clean, on the intended commit; all checks in `docs/RUNBOOK.md` pass.
2. Confirm `app.json` bundle identifier and `eas.json` profile (`preview` = internal, `production` = store; `autoIncrement` handles build numbers).
3. Confirm no new or changed child-facing copy is awaiting clinical review (`docs/CLINICAL.md`).
4. Confirm `firestore.rules` changes (if any) are deployed or queued, and that env vars exist in EAS.
5. Ask the user to confirm, then run (check current EAS docs for flags):
   `npx eas-cli build --platform ios --profile production`
6. After the build, `npx eas-cli submit --platform ios` only on a further explicit go-ahead.
7. Record the release and anything that went wrong in `docs/RUNBOOK.md`.
