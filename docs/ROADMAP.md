# Roadmap

Source of truth for progress. Keep `CLAUDE.md` pointing here rather than ticking items there.

Status below was inferred from the repo on 2026-10-03 (files present, `tsc` clean, `lib/*.check.mjs` passing). **Owner: confirm or correct it.**

## Phase 1 — Foundation (no camera, no AI)
- [x] Register screen (email/password) and Google sign-in
- [~] Login screen — `app/(auth)/login.tsx` exists; confirm it is the real form
- [x] Child setup (name, age, avatar) — `app/onboarding/child-setup.tsx`
- [~] Home dashboard — `app/(tabs)/home.tsx` exists; confirm today's-status UI
- [x] `BrushTimer` component
- [~] Brushing session — implemented as `app/session.tsx` + `app/results.tsx` (CLAUDE.md planned `(tabs)/brush.tsx`)
- [x] Session save with offline outbox (`lib/outbox.ts`, `lib/sessions.ts`)
- [x] Streaks and badges (`lib/streak.ts`, `lib/badges.ts`)
- [~] Progress history — `app/(tabs)/progress.tsx` exists; confirm list and scores

## Before Phase 2
- [ ] Test and CI baseline (see RUNBOOK) — started
- [ ] Firestore rules reviewed against the privacy checklist
- [ ] Portuguese (BR) strings — launch target is PT-BR + English; no i18n layer yet

## Phase 2 — Camera and AI (not started)
- [ ] Decide face/mouth detection approach (ADR needed: vision-camera vs MediaPipe)
- [ ] `MouthMap` live overlay
- [ ] Gemini coach in `lib/coach.ts` with the local generator as fallback. Verify the current model name first; the 1.5 series is being retired
- [ ] Clinical advisor review of all coach templates

## Phase 3 — Subscriptions (not started): RevenueCat
## Phase 4 — Android (not started)
