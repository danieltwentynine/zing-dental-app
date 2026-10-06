# 0001. Record decisions as ADRs

- Status: Accepted
- Date: 2026-10-03

## Context
The app is built and maintained partly by AI agents that start each session with no memory. The reasons behind choices (for example "plain node `.check.mjs` instead of a test framework", "no `any`", Expo/Firebase quirks) otherwise live only in people's heads.

## Decision
Record each non-obvious decision as a short ADR in `docs/decisions/`. Agents read them before changing the area they cover.

## Consequences
Small upkeep cost per decision; far fewer repeated debates and accidental reversals.
