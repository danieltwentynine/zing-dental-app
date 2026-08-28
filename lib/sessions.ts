import {
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import type { ToothZone } from '@/types';
import { db, timestampToDate } from '@/lib/firebase';

export interface SavedSessionInput {
  id: string;
  childId: string;
  parentUid: string;
  /** When brushing actually finished — captured at finish, so a later retry
   *  files the session under the day it happened, not the day it was saved. */
  completedAt: Date;
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

const sessionDocSchema = z.object({
  score: z.number(),
  completedAt: timestampToDate.optional(),
});

/** Reserve an id up front so a retry overwrites the same doc instead of duplicating it. */
export function newSessionId(): string {
  return doc(collection(db, 'sessions')).id;
}

/** Persist a finished session — idempotent in `input.id`, never throws to the child UI. */
export async function saveSession(input: SavedSessionInput): Promise<boolean> {
  try {
    await setDoc(doc(db, 'sessions', input.id), {
      childId: input.childId,
      parentUid: input.parentUid,
      startedAt: Timestamp.fromDate(
        new Date(input.completedAt.getTime() - input.durationSeconds * 1000),
      ),
      completedAt: Timestamp.fromDate(input.completedAt),
      durationSeconds: input.durationSeconds,
      zonesDetected: input.zonesDetected,
      zonesCoverage: input.zonesCoverage,
      score: input.score,
      coachMessage: input.coachMessage,
      streak: input.streak,
    });
    return true;
  } catch {
    return false;
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
