import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  limit,
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
    const ref = await addDoc(collection(db, 'sessions'), {
      childId: input.childId,
      parentUid: input.parentUid,
      startedAt: Timestamp.fromDate(new Date(Date.now() - input.durationSeconds * 1000)),
      completedAt: serverTimestamp(),
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

// Equality-only query + client-side sort: needs no composite index and includes
// parentUid so the security rules can prove the query only touches this parent's
// sessions. Revisit with an indexed orderBy once history can outgrow the cap.
const FETCH_CAP = 200;

export async function fetchRecentSessions(
  parentUid: string,
  childId: string,
  max = 10,
): Promise<RecentSession[]> {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('parentUid', '==', parentUid),
      where('childId', '==', childId),
      limit(FETCH_CAP),
    );
    const snap = await getDocs(q);
    const sessions = snap.docs.flatMap((d) => {
      const parsed = sessionDocSchema.safeParse(d.data());
      if (!parsed.success) return [];
      return [{ id: d.id, score: parsed.data.score, completedAt: parsed.data.completedAt ?? new Date() }];
    });
    sessions.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    return sessions.slice(0, max);
  } catch {
    return [];
  }
}
