// Outbox self-check — run: node lib/outbox.check.mjs
// Plain node + assert on purpose: this repo has no test framework and doesn't need one.
// lib/outbox.ts stays free of firebase/AsyncStorage imports so it can run here.
import assert from 'node:assert/strict';

import { decodeOutbox, encodeOutbox } from './outbox.ts';

const entry = (over = {}) => ({
  id: 'sess-1',
  childId: 'child-1',
  parentUid: 'parent-1',
  completedAt: '2026-08-28T21:00:00.000Z',
  durationSeconds: 120,
  zonesDetected: ['top-front', 'bottom-front'],
  zonesCoverage: { 'top-front': 100, 'top-left': 0 },
  score: 80,
  coachMessage: 'Nice brushing!',
  streak: 3,
  ...over,
});

// --- round trip ---
const one = entry();
assert.deepEqual(decodeOutbox(encodeOutbox([one])), [one], 'a session survives encode → decode unchanged');
assert.equal(
  new Date(decodeOutbox(encodeOutbox([one]))[0].completedAt).getTime(),
  Date.parse('2026-08-28T21:00:00.000Z'),
  'completedAt round-trips to the same instant',
);

// --- nothing pending ---
assert.deepEqual(decodeOutbox(null), [], 'an empty outbox key reads as nothing pending');
assert.deepEqual(decodeOutbox(''), [], 'an empty string reads as nothing pending');
assert.deepEqual(decodeOutbox('[]'), [], 'an empty array reads as nothing pending');

// --- malformed storage must never throw ---
assert.deepEqual(decodeOutbox('{"id":"sess'), [], 'half-written JSON is discarded, not thrown');
assert.deepEqual(decodeOutbox('"not an array"'), [], 'a non-array payload is discarded');
assert.deepEqual(decodeOutbox('{"id":"sess-1"}'), [], 'an object payload is discarded');
assert.deepEqual(decodeOutbox(JSON.stringify([null, 7, 'x'])), [], 'non-object entries are dropped');

// --- one bad entry must not strand the good ones ---
const mixed = JSON.stringify([
  entry({ id: '' }), // empty id: nothing to write to
  { id: 'sess-old', score: 50 }, // an older app version's shape
  entry({ completedAt: 'not-a-date' }),
  entry({ score: 'eighty' }),
  entry({ zonesCoverage: { 'top-front': 'all' } }),
  entry({ parentUid: undefined }), // COPPA scoping field missing
  entry({ id: 'sess-good' }),
]);
assert.deepEqual(
  decodeOutbox(mixed).map((e) => e.id),
  ['sess-good'],
  'malformed entries are dropped individually; the valid one still flushes',
);

// --- the outbox cannot grow without bound ---
const many = Array.from({ length: 30 }, (_, i) => entry({ id: `sess-${i}` }));
const capped = decodeOutbox(encodeOutbox(many));
assert.equal(capped.length, 20, 'the outbox is capped');
assert.equal(capped[0].id, 'sess-10', 'the cap keeps the newest sessions');
assert.equal(capped.at(-1).id, 'sess-29', 'the cap keeps the newest sessions');

console.log('outbox check ok (14 assertions)');
