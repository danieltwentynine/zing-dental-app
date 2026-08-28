import { z } from 'zod';

/**
 * On-device outbox for finished sessions that Firestore hasn't confirmed yet.
 * Kept dependency-free (no firebase, no AsyncStorage) so `lib/outbox.check.mjs`
 * can run it under plain node — the storage side lives in `lib/sessions.ts`.
 */
export const OUTBOX_KEY = 'zing.sessionOutbox.v1';

/** Newest wins. A backlog deeper than this means something is badly wrong anyway. */
const MAX_ENTRIES = 20;

/** The stored shape: one session doc, JSON-safe (dates as ISO strings). */
const pendingSessionSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1),
  parentUid: z.string().min(1),
  completedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'unparseable date'),
  durationSeconds: z.number(),
  zonesDetected: z.array(z.string()),
  zonesCoverage: z.record(z.string(), z.number()),
  score: z.number(),
  coachMessage: z.string(),
  streak: z.number(),
});

export type PendingSession = z.infer<typeof pendingSessionSchema>;

export function encodeOutbox(entries: PendingSession[]): string {
  return JSON.stringify(entries.slice(-MAX_ENTRIES));
}

/**
 * Storage is untrusted input: bad JSON, a half-written value, or entries from an
 * older app version must degrade to "nothing pending" — never crash the launch.
 * Malformed entries are dropped individually so one bad row can't strand good ones.
 */
export function decodeOutbox(raw: string | null): PendingSession[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    const entry = pendingSessionSchema.safeParse(item);
    return entry.success ? [entry.data] : [];
  });
}
