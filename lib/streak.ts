/**
 * Civil-day number: identical for any two Dates that fall on the same local
 * calendar date. Read from the date's local Y/M/D (same convention as
 * `sameDay` in lib/dates.ts), not from epoch arithmetic, so a 23- or 25-hour
 * DST day is still exactly one day apart.
 */
const dayIndex = (d: Date): number =>
  Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000;

/**
 * The child's streak after finishing a session at `now`.
 * Kept dependency-free so `lib/streak.check.mjs` can run it under plain node.
 *
 * ponytail: days are resolved against the device's *current* timezone, so a
 * parent who flies across zones (or changes the device clock) shifts what
 * "today" means and can keep or lose a day. Inherent to local calendar days;
 * move to a server timestamp if that ever matters.
 */
export function nextStreak(
  child: { streakCurrent: number; lastSessionAt?: Date },
  now: Date,
): number {
  if (!child.lastSessionAt) return 1;
  const gap = dayIndex(now) - dayIndex(child.lastSessionAt);
  if (gap <= 0) return Math.max(child.streakCurrent, 1); // same day, or clock moved back
  if (gap === 1) return child.streakCurrent + 1;
  return 1; // a day was missed
}
