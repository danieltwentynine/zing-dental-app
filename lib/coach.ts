import type { ToothZone } from '@/types';

/**
 * Builds a warm, kid-friendly coaching message (CLAUDE.md > Gemini Coach voice).
 * Phase 1 uses this local generator; Phase 2 will swap in the Gemini Flash call
 * with this as the offline/rate-limited fallback. Never clinical, never scolding.
 */
export function buildCoachMessage(childName: string, missedZones: ToothZone[], score: number): string {
  const name = childName.trim() || 'friend';
  if (missedZones.length === 0 || score >= 100) {
    return `You did it, ${name}! Keep brushing every day and your teeth will sparkle.`;
  }
  const missedBackTeeth = missedZones.some((z) => z.includes('back'));
  if (missedBackTeeth) {
    return `Awesome job, ${name}! Tomorrow, try to reach all the way to your back teeth.`;
  }
  return `Great brushing today, ${name}! Your smile is getting stronger every day.`;
}
