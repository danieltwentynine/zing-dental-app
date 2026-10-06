// Spike stats self-check — run: node lib/spikeStats.check.mjs
import assert from 'node:assert/strict';

import { summarize, trim } from './spikeStats.ts';

const s = (at, faceCount, mouthFound) => ({ at, faceCount, mouthFound });

assert.deepEqual(summarize([], 1000), { samples: 0, callbacksPerSecond: 0, faceFoundRatio: 0, mouthFoundRatio: 0 }, 'empty window is all zeros');

const samples = [s(0, 1, true), s(500, 1, false), s(1000, 0, false), s(1500, 1, true)];
const stats = summarize(samples, 2000);
assert.equal(stats.samples, 4, 'all samples inside a 2s window at t=2000');
assert.equal(stats.callbacksPerSecond, 2, '4 samples over a 2s window = 2/s');
assert.equal(stats.faceFoundRatio, 0.75, '3 of 4 had a face');
assert.equal(stats.mouthFoundRatio, 0.5, '2 of 4 had a mouth');

assert.equal(summarize(samples, 2600).samples, 2, 'samples at t=0 and t=500 fall out of the window');
assert.equal(trim(samples, 2600).length, 2, 'trim drops old samples');
console.log('spikeStats check ok (7 assertions)');
