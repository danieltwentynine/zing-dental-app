// Streak self-check — run: node lib/streak.check.mjs
// Also run under a DST zone to exercise the boundary cases:
//   TZ=America/New_York node lib/streak.check.mjs
// Plain node + assert on purpose: this repo has no test framework and doesn't need one.
import assert from 'node:assert/strict';

import { nextStreak } from './streak.ts';

const now = new Date(2026, 7, 28, 21, 0, 0);
const daysAgo = (n) => new Date(2026, 7, 28 - n, 8, 30, 0);

assert.equal(nextStreak({ streakCurrent: 0 }, now), 1, 'first ever session starts the streak');
assert.equal(nextStreak({ streakCurrent: 3, lastSessionAt: daysAgo(0) }, now), 3, 'second session same day keeps the streak');
assert.equal(nextStreak({ streakCurrent: 0, lastSessionAt: daysAgo(0) }, now), 1, 'same day but streak never counted still counts today');
assert.equal(nextStreak({ streakCurrent: 3, lastSessionAt: daysAgo(1) }, now), 4, 'brushing yesterday and today extends the streak');
assert.equal(nextStreak({ streakCurrent: 9, lastSessionAt: daysAgo(2) }, now), 1, 'a missed day resets the streak');
assert.equal(nextStreak({ streakCurrent: 5, lastSessionAt: new Date(2026, 7, 29, 8, 0, 0) }, now), 5, 'a clock moved backwards must not punish the child');

// --- Boundaries where the two dates sit under different UTC offsets ---
// Northern-hemisphere DST dates: spring forward 2026-03-08, fall back 2026-11-01.
const springBefore = new Date(2026, 2, 7, 21, 0, 0);
const springAfter = new Date(2026, 2, 8, 8, 30, 0);
const fallBefore = new Date(2026, 9, 31, 21, 0, 0);
const fallAfter = new Date(2026, 10, 1, 8, 30, 0);

assert.equal(nextStreak({ streakCurrent: 4, lastSessionAt: springBefore }, springAfter), 5, 'spring forward: a 23-hour day still extends the streak');
assert.equal(nextStreak({ streakCurrent: 4, lastSessionAt: fallBefore }, fallAfter), 5, 'fall back: a 25-hour day still extends the streak');
assert.equal(nextStreak({ streakCurrent: 4, lastSessionAt: new Date(2026, 10, 1, 0, 30, 0) }, new Date(2026, 10, 1, 23, 30, 0)), 4, 'fall back: both sessions on the same 25-hour day keep the streak');
assert.equal(nextStreak({ streakCurrent: 7, lastSessionAt: new Date(2026, 2, 6, 21, 0, 0) }, springAfter), 1, 'spring forward: a genuinely missed day still resets');

const offsetChanged =
  springBefore.getTimezoneOffset() !== springAfter.getTimezoneOffset() &&
  fallBefore.getTimezoneOffset() !== fallAfter.getTimezoneOffset();

console.log('streak check ok (10 assertions)');
console.log(
  offsetChanged
    ? `DST boundaries exercised: the paired dates differ in UTC offset in ${Intl.DateTimeFormat().resolvedOptions().timeZone}.`
    : `NOTE: ${Intl.DateTimeFormat().resolvedOptions().timeZone} has no DST transition on 2026-03-08/2026-11-01, so those cases ran with a constant offset and did NOT exercise a boundary. Re-run with TZ=America/New_York.`,
);
