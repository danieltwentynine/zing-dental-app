---
name: add-firestore-collection
description: Add or change Firestore data (collection, fields, queries) in Zing with Zod validation and parent-scoped security rules. Use whenever data shape or firestore.rules change.
---

# Add or change Firestore data

COPPA-critical: all child data is scoped to the authenticated parent via `parentUid`. Children never authenticate.

1. Update the shared type in `types/index.ts` (no parallel type definitions).
2. Add a Zod schema in the relevant `lib/` module and **parse every Firestore read** — stored data can be malformed. Wrap reads and writes in try/catch with a user-friendly fallback; never surface technical errors to a child.
3. Every document carries `parentUid`. Every query filters on it.
4. Edit `firestore.rules`: match the existing pattern (`ownsExisting`/`ownsIncoming`; updates require both so `parentUid` can't be reassigned). Default is deny.
5. Store only derived data (zone coverage, scores). Never video, images, or camera frames.
6. If the logic is pure, put it in its own `lib/` file with a `*.check.mjs` (see `lib/outbox.ts`).
7. Run the checks in `docs/RUNBOOK.md`, then ask the `privacy-reviewer` agent to review the diff.
8. If the schema changes in a way that affects existing documents, write an ADR in `docs/decisions/` covering migration.
