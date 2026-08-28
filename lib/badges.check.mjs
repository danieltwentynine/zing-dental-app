// Badge-awarding self-check — run: node lib/badges.check.mjs
// Plain node + assert on purpose: this repo has no test framework and doesn't need one.
import assert from 'node:assert/strict';

import {
  daysBrushedThisWeek,
  newBadges,
  PERFECT_SCORE,
  STREAK_BADGE_DAYS,
  WEEKLY_GOAL_DAYS,
} from './badges.ts';

const now = new Date(2026, 7, 28, 21, 0, 0); // a Friday
const types = (existing, outcome) => newBadges(existing, outcome, now).map((b) => b.type).sort();
const held = (...t) => t.map((type) => ({ id: type, name: type, type, earnedAt: new Date(2026, 0, 1) }));
// Every outcome needs all four inputs; these defaults keep each case to its one variable.
const outcome = (o) => ({ totalSessions: 4, streakCurrent: 1, score: 50, daysThisWeek: 1, ...o });

// First session ever.
assert.deepEqual(types([], outcome({ totalSessions: 1, score: 60 })), ['firstSession']);

// No duplicates on a second qualifying session.
assert.deepEqual(types(held('firstSession'), outcome({ totalSessions: 2, score: 60 })), []);
assert.deepEqual(
  types(held('firstSession', 'perfect'), outcome({ totalSessions: 2, score: 100 })),
  [],
  'a second perfect score awards nothing new',
);

// Perfect only at 100.
assert.deepEqual(types(held('firstSession'), outcome({ score: 99 })), []);
assert.deepEqual(types(held('firstSession'), outcome({ score: PERFECT_SCORE })), ['perfect']);

// Streak threshold boundary.
assert.deepEqual(
  types(held('firstSession'), outcome({ streakCurrent: STREAK_BADGE_DAYS - 1 })),
  [],
  'one day short of the streak badge earns nothing',
);
assert.deepEqual(types(held('firstSession'), outcome({ streakCurrent: STREAK_BADGE_DAYS })), ['streak']);

// Weekly goal counts DAYS brushed this week, not sessions.
assert.deepEqual(
  types(held('firstSession', 'streak'), outcome({ daysThisWeek: WEEKLY_GOAL_DAYS - 1, streakCurrent: 6 })),
  [],
  'six days into the week earns nothing yet',
);
assert.deepEqual(
  types(held('firstSession', 'streak'), outcome({ totalSessions: 99, daysThisWeek: 1, streakCurrent: 1 })),
  [],
  'a pile of sessions in a single day is not a weekly star',
);
const week = newBadges(
  held('firstSession', 'streak'),
  outcome({ daysThisWeek: WEEKLY_GOAL_DAYS, streakCurrent: 7 }),
  now,
);
assert.deepEqual(week.map((b) => b.type), ['weeklyGoal'], 'exactly one new badge');
assert.equal(week[0].name, 'Weekly Star', 'name reuses the BadgeCard label');
assert.equal(week[0].earnedAt, now);

// A stale-counter child backfilled to a real history can earn several at once.
assert.deepEqual(
  types([], outcome({ totalSessions: 30, streakCurrent: 9, score: 100, daysThisWeek: 7 })),
  ['firstSession', 'perfect', 'streak', 'weeklyGoal'],
);

// --- daysBrushedThisWeek ---
const mondayOffset = (now.getDay() + 6) % 7;
const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
const dayInWeek = (i, hour = 9) =>
  new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, hour, 0, 0);

assert.equal(daysBrushedThisWeek([], now), 0, 'no sessions, no days');
assert.equal(daysBrushedThisWeek([dayInWeek(0), dayInWeek(0, 20)], now), 1, 'twice a day is still one day');
assert.equal(
  daysBrushedThisWeek([0, 1, 2, 3, 4, 5, 6].flatMap((i) => [dayInWeek(i), dayInWeek(i, 20)]), now),
  WEEKLY_GOAL_DAYS,
  'twice a day all week is a full week',
);
assert.equal(
  daysBrushedThisWeek([new Date(monday.getTime() - 86_400_000), dayInWeek(0)], now),
  1,
  'last week does not count toward this week',
);
assert.equal(
  daysBrushedThisWeek([dayInWeek(7), dayInWeek(0)], now),
  1,
  'next week does not count toward this week',
);

console.log('badges check ok (18 assertions)');
