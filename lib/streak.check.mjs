// Streak self-check — run: node lib/streak.check.mjs
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

console.log('streak check ok (6 assertions)');
