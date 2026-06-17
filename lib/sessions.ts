import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import type { ToothZone } from '@/types';
import { db } from '@/lib/firebase';

export interface SavedSessionInput {
  childId: string;
  parentUid: string;
  durationSeconds: number;
  zonesDetected: ToothZone[];
  zonesCoverage: Record<string, number>;
  score: number;
  coachMessage: string;
  streak: number;
}

export interface RecentSession {
  id: string;
  score: number;
  completedAt: Date;
}

const timestampToDate = z
  .custom<Timestamp>((v) => v instanceof Timestamp)
  .transform((t) => t.toDate());

const sessionDocSchema = z.object({
  score: z.number(),
  completedAt: timestampToDate.optional(),
});

/** Persist a finished session. Returns the new id, or null on failure (never throws to the child UI). */
export async function saveSession(input: SavedSessionInput): Promise<string | null> {
  try {
    const now = serverTimestamp();
    const ref = await addDoc(collection(db, 'sessions'), {
      childId: input.childId,
      parentUid: input.parentUid,
      startedAt: now,
      completedAt: now,
      durationSeconds: input.durationSeconds,
      zonesDetected: input.zonesDetected,
      zonesCoverage: input.zonesCoverage,
      score: input.score,
      coachMessage: input.coachMessage,
      streak: input.streak,
    });
    return ref.id;
  } catch {
    return null;
  }
}

export async function fetchRecentSessions(childId: string, max = 10): Promise<RecentSession[]> {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('childId', '==', childId),
      orderBy('completedAt', 'desc'),
      limit(max),
    );
    const snap = await getDocs(q);
    return snap.docs.flatMap((d) => {
      const parsed = sessionDocSchema.safeParse(d.data());
      if (!parsed.success) return [];
      return [{ id: d.id, score: parsed.data.score, completedAt: parsed.data.completedAt ?? new Date() }];
    });
  } catch {
    return [];
  }
}
