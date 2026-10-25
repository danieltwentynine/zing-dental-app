import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import type { Badge, ChildProfile } from '@/types';
import { daysBrushedThisWeek, newBadges } from '@/lib/badges';
import { db, timestampToDate } from '@/lib/firebase';
import { fetchRecentSessions } from '@/lib/sessions';

const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['streak', 'perfect', 'firstSession', 'weeklyGoal']),
  earnedAt: timestampToDate,
});

// Firestore data can be malformed — validate every read (CLAUDE.md rule).
const childDocSchema = z.object({
  parentUid: z.string(),
  name: z.string(),
  age: z.number(),
  avatarId: z.string(),
  streakCurrent: z.number().default(0),
  streakBest: z.number().default(0),
  totalSessions: z.number().default(0),
  badges: z.array(badgeSchema).default([]),
  createdAt: timestampToDate.optional(),
  lastSessionAt: timestampToDate.optional(),
});

export interface NewChildInput {
  name: string;
  age: number;
  avatarId: string;
}

export async function createChild(parentUid: string, input: NewChildInput): Promise<ChildProfile> {
  const profile = { parentUid, ...input, streakCurrent: 0, streakBest: 0, totalSessions: 0, badges: [] as Badge[] };
  const ref = await addDoc(collection(db, 'children'), { ...profile, createdAt: serverTimestamp() });
  return { id: ref.id, ...profile, createdAt: new Date() };
}

/**
 * The parent's first (active) child, or null if they have none yet.
 * Throws on query failure so callers can tell an outage apart from "no child"
 * — mixing the two would send an existing parent back through child setup.
 * Equality-only filter + client-side sort: needs no composite index and stays
 * provably within the parentUid security rules.
 */
export async function fetchActiveChild(parentUid: string): Promise<ChildProfile | null> {
  const q = query(collection(db, 'children'), where('parentUid', '==', parentUid));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const children = snap.docs.flatMap((docSnap) => {
    const parsed = childDocSchema.safeParse(docSnap.data());
    if (!parsed.success) return [];
    return [
      {
        id: docSnap.id,
        ...parsed.data,
        createdAt: parsed.data.createdAt ?? new Date(),
      },
    ];
  });
  if (children.length === 0) {
    throw new Error('Child documents exist but none passed validation');
  }

  children.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return children[0];
}

/** Matches the internal doc cap of `fetchRecentSessions`. */
const SESSION_COUNT_CAP = 200;

export interface SessionRecord {
  streakCurrent: number;
  score: number;
  now: Date;
}

/**
 * Advance the child's counters and award any newly earned badges after a
 * session was persisted. `streakCurrent`, `score` and `now` come from the
 * caller so the session doc and the profile agree on the same streak, the same
 * score and the same clock reading.
 *
 * Returns the updated profile for the store, or null if the write failed — the
 * session itself is already saved, so the counters and badges catch up on the
 * next one.
 */
export async function recordSession(
  child: ChildProfile,
  session: SessionRecord,
): Promise<ChildProfile | null> {
  const { streakCurrent, score, now } = session;
  const streakBest = Math.max(child.streakBest, streakCurrent);
  let counted: number | null = null;
  let totalSessions = child.totalSessions + 1;
  let earned: Badge[] = [];

  // Everything from here degrades quietly: the session doc is already saved.
  try {
    // This child's history, including the session just saved — null when it
    // can't be trusted (failed, or capped out), so we fall back to a blind
    // increment. Children created before session counting existed carry a
    // stale `totalSessions: 0`; reconciling from the docs backfills them.
    // ponytail: the count saturates at SESSION_COUNT_CAP, after which a child
    // goes back to incrementing (both count badges long earned by then).
    // Upgrade path: an indexed count() aggregate.
    const sessions = await fetchRecentSessions(child.parentUid, child.id, SESSION_COUNT_CAP);
    const history = sessions.length === 0 || sessions.length >= SESSION_COUNT_CAP ? null : sessions;
    // Never walk the counter backwards if the history read came up short.
    counted = history ? Math.max(history.length, child.totalSessions) : null;
    totalSessions = counted ?? totalSessions;
    earned = newBadges(
      child.badges,
      {
        totalSessions,
        streakCurrent,
        score,
        // No trustworthy history means no week to count; the badge catches up
        // on the next session rather than being awarded on a guess.
        daysThisWeek: history ? daysBrushedThisWeek(history.map((s) => s.completedAt), now) : 0,
      },
      now,
    );
    await updateDoc(doc(db, 'children', child.id), {
      totalSessions: counted ?? increment(1),
      streakCurrent,
      streakBest,
      lastSessionAt: Timestamp.fromDate(now),
      // Timestamp, not serverTimestamp() — a sentinel inside an array is illegal
      // and a raw Date wouldn't survive `badgeSchema` on the way back.
      ...(earned.length > 0
        ? {
            badges: [...child.badges, ...earned].map((badge) => ({
              ...badge,
              earnedAt: Timestamp.fromDate(badge.earnedAt),
            })),
          }
        : {}),
    });
  } catch {
    return null;
  }
  return {
    ...child,
    totalSessions,
    streakCurrent,
    streakBest,
    badges: [...child.badges, ...earned],
    lastSessionAt: now,
  };
}
