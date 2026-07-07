import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import type { Badge, ChildProfile } from '@/types';
import { db } from '@/lib/firebase';

const timestampToDate = z
  .custom<Timestamp>((v) => v instanceof Timestamp)
  .transform((t) => t.toDate());

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
});

export interface NewChildInput {
  name: string;
  age: number;
  avatarId: string;
}

export async function createChild(parentUid: string, input: NewChildInput): Promise<ChildProfile> {
  const ref = await addDoc(collection(db, 'children'), {
    parentUid,
    name: input.name,
    age: input.age,
    avatarId: input.avatarId,
    streakCurrent: 0,
    streakBest: 0,
    totalSessions: 0,
    badges: [] as Badge[],
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    parentUid,
    name: input.name,
    age: input.age,
    avatarId: input.avatarId,
    streakCurrent: 0,
    streakBest: 0,
    totalSessions: 0,
    badges: [],
    createdAt: new Date(),
  };
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
