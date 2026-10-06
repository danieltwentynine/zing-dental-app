/**
 * Rolling-window metrics for the Phase 2 camera spike (docs/decisions/0002).
 * Pure and dependency-free so `lib/spikeStats.check.mjs` can run it under plain node.
 * Holds only counts and timestamps — never frames, images or face geometry.
 */
export interface DetectionSample {
  /** ms timestamp of the detector callback */
  at: number;
  faceCount: number;
  /** true when the first face reported all three mouth landmarks */
  mouthFound: boolean;
}

export interface WindowStats {
  samples: number;
  callbacksPerSecond: number;
  faceFoundRatio: number;
  mouthFoundRatio: number;
}

export function summarize(samples: readonly DetectionSample[], now: number, windowMs = 2000): WindowStats {
  const inWindow = samples.filter((s) => now - s.at <= windowMs);
  if (inWindow.length === 0) {
    return { samples: 0, callbacksPerSecond: 0, faceFoundRatio: 0, mouthFoundRatio: 0 };
  }
  const withFace = inWindow.filter((s) => s.faceCount > 0).length;
  const withMouth = inWindow.filter((s) => s.mouthFound).length;
  return {
    samples: inWindow.length,
    callbacksPerSecond: inWindow.length / (windowMs / 1000),
    faceFoundRatio: withFace / inWindow.length,
    mouthFoundRatio: withMouth / inWindow.length,
  };
}

/** Drops samples older than the window so the buffer never grows. */
export function trim(samples: DetectionSample[], now: number, windowMs = 2000): DetectionSample[] {
  return samples.filter((s) => now - s.at <= windowMs);
}
