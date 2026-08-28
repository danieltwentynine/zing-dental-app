import type { Badge } from '@/types';

type BadgeType = Badge['type'];

export const PERFECT_SCORE = 100;
/** Days in a row that count as a real habit, not a lucky pair. */
export const STREAK_BADGE_DAYS = 3;
/** Days brushed in the current Mon–Sun week to earn "Weekly Star" — the whole
 *  week, matching the 7-dot "This week" strip on the progress screen. */
export const WEEKLY_GOAL_DAYS = 7;

/** Child-facing copy — same labels the locked/earned cards already show
 *  (components/kids/BadgeCard.tsx). Never clinical, never medical advice. */
const BADGE_NAMES: Record<BadgeType, string> = {
  firstSession: 'First Brush',
  streak: 'On Fire',
  perfect: 'Perfect Brush',
  weeklyGoal: 'Weekly Star',
};

export interface SessionOutcome {
  /** Sessions this child has finished, the one just saved included. */
  totalSessions: number;
  streakCurrent: number;
  score: number;
  /** Distinct days brushed in the current Mon–Sun week, this session included. */
  daysThisWeek: number;
}

/**
 * Distinct local calendar days brushed in the Mon–Sun week containing `now`.
 * Same week boundary and same "any session that day counts" rule as the
 * progress screen's week strip, so the badge can never disagree with the dots
 * the child is looking at.
 */
export function daysBrushedThisWeek(sessionDates: readonly Date[], now: Date): number {
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
  const days = new Set<number>();
  for (const d of sessionDates) {
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const offset = Math.round((dayStart.getTime() - monday.getTime()) / 86_400_000);
    if (offset >= 0 && offset < 7) days.add(offset);
  }
  return days.size;
}

/**
 * The badges this session newly earns. One badge per type per child — a type
 * already held is never awarded again, so the id can be the type itself.
 * `earnedAt` stays a plain Date here; the Firestore writer converts it to a
 * Timestamp. Kept dependency-free so `lib/badges.check.mjs` runs under node.
 */
export function newBadges(
  existing: readonly Badge[],
  outcome: SessionOutcome,
  earnedAt: Date,
): Badge[] {
  const held = new Set(existing.map((b) => b.type));
  const qualified: BadgeType[] = [];
  if (outcome.totalSessions >= 1) qualified.push('firstSession');
  if (outcome.score >= PERFECT_SCORE) qualified.push('perfect');
  if (outcome.streakCurrent >= STREAK_BADGE_DAYS) qualified.push('streak');
  if (outcome.daysThisWeek >= WEEKLY_GOAL_DAYS) qualified.push('weeklyGoal');

  return qualified
    .filter((type) => !held.has(type))
    .map((type) => ({ id: type, name: BADGE_NAMES[type], type, earnedAt }));
}
