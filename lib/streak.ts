/** Local-day number: identical for any two Dates on the same calendar day. */
const dayIndex = (d: Date): number =>
  Math.floor((d.getTime() - d.getTimezoneOffset() * 60_000) / 86_400_000);

/**
 * The child's streak after finishing a session at `now`.
 * Kept dependency-free so `lib/streak.check.mjs` can run it under plain node.
 *
 * ponytail: device-local calendar days. A parent crossing timezones can keep or
 * gain a day; move to a server timestamp if that ever matters.
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
