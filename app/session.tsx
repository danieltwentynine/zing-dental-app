import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Sparkle, X } from 'phosphor-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrushTimer } from '@/components/brushing/BrushTimer';
import { MouthMap, type ZoneState } from '@/components/brushing/MouthMap';
import { buildCoachMessage } from '@/lib/coach';
import { ALL_TOOTH_ZONES, BRUSHING_DURATION_SECONDS, COUNTDOWN_SECONDS } from '@/lib/constants';
import { tokens } from '@/lib/tokens';
import { useChildStore } from '@/stores/childStore';
import { useSessionStore } from '@/stores/sessionStore';
import type { ToothZone } from '@/types';

const ZONE_HINTS: Record<ToothZone, string> = {
  'top-front': 'Brush your top front teeth',
  'top-left': 'Now the top left',
  'top-right': 'Now the top right',
  'top-back-left': 'Reach the top back left',
  'top-back-right': 'Reach the top back right',
  'bottom-front': 'Down to the bottom front',
  'bottom-left': 'Bottom left now',
  'bottom-right': 'Bottom right — nice!',
  'bottom-back-left': "Back teeth — you've got this",
  'bottom-back-right': 'Last one — keep going!',
};

export default function SessionScreen() {
  const child = useChildStore((s) => s.activeChild);
  const setLastResult = useSessionStore((s) => s.setLastResult);
  const saveLastResult = useSessionStore((s) => s.saveLastResult);

  const [phase, setPhase] = useState<'countdown' | 'active'>('countdown');
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [remaining, setRemaining] = useState(BRUSHING_DURATION_SECONDS);
  const remainingRef = useRef(BRUSHING_DURATION_SECONDS);
  const finishedRef = useRef(false);
  const childName = child?.name ?? 'friend';

  // Zone progress is derived from the clock: one source of truth, no drift.
  const elapsed = BRUSHING_DURATION_SECONDS - remaining;
  const zonesReached = Math.min(
    ALL_TOOTH_ZONES.length,
    Math.floor((elapsed / BRUSHING_DURATION_SECONDS) * ALL_TOOTH_ZONES.length),
  );

  const zoneStates = useMemo(() => {
    const ns: Partial<Record<ToothZone, ZoneState>> = {};
    ALL_TOOTH_ZONES.forEach((z, i) => {
      if (i < zonesReached) ns[z] = 'done';
      else if (i === zonesReached) ns[z] = 'active';
    });
    return ns;
  }, [zonesReached]);

  // Countdown 3 → 2 → 1 → Go!
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count < 0) {
      setPhase('active');
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const total = BRUSHING_DURATION_SECONDS;
    const elapsedAtFinish = Math.min(total, Math.max(0, total - remainingRef.current));
    const reached = Math.min(
      ALL_TOOTH_ZONES.length,
      Math.floor((elapsedAtFinish / total) * ALL_TOOTH_ZONES.length),
    );

    const final: Partial<Record<ToothZone, ZoneState>> = {};
    const missed: ToothZone[] = [];
    ALL_TOOTH_ZONES.forEach((z, i) => {
      if (i < reached) {
        final[z] = 'done';
      } else {
        final[z] = 'missed';
        missed.push(z);
      }
    });

    const score = Math.round((reached / ALL_TOOTH_ZONES.length) * 100);
    const coachMessage = buildCoachMessage(child?.name ?? 'friend', missed, score);

    setLastResult({
      score,
      zoneStates: final,
      missed,
      durationSeconds: elapsedAtFinish,
      coachMessage,
    });

    // Fire-and-forget: the store reports progress to the results screen, so a
    // slow or offline write never holds the child on the session screen.
    void saveLastResult();

    setTimeout(() => router.replace('/results'), 350);
  }, [child, setLastResult, saveLastResult]);

  // Active session — a 2-minute guided walk through every zone. Side effects
  // live in the interval callback so the state updaters stay pure.
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      const next = remainingRef.current - 1;
      remainingRef.current = next;
      setRemaining(Math.max(0, next));
      if (next <= 0) {
        clearInterval(interval);
        finish();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, finish]);

  const currentZone = ALL_TOOTH_ZONES[Math.min(zonesReached, ALL_TOOTH_ZONES.length - 1)];

  return (
    <LinearGradient colors={['#0b3b3a', '#051c20']} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel brushing"
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 12,
            right: 20,
            zIndex: 5,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} color="#fff" weight="bold" />
        </Pressable>

        {phase === 'countdown' ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: 10 }}>
            <Text className="font-numeric" style={{ fontSize: 140, color: '#fff', lineHeight: 150 }}>
              {count <= 0 ? 'Go!' : count}
            </Text>
            <Text className="font-bodySemibold" style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)' }}>
              Get your toothbrush ready, {childName}!
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 }}>
            {/* Guided-brushing indicator (Phase 1 has no camera yet) */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 7,
                backgroundColor: 'rgba(0,201,167,0.18)',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 999,
                marginTop: 8,
              }}
            >
              <Sparkle size={14} color="#54dcc2" weight="fill" />
              <Text className="font-bodySemibold" style={{ fontSize: 12, color: '#8fe9d8' }}>
                FOLLOW SPARKY'S GUIDE
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <MouthMap states={zoneStates} size={260} />
            </View>

            <Text
              className="font-display"
              style={{ fontSize: 22, color: '#fff', textAlign: 'center', minHeight: 30 }}
            >
              {ZONE_HINTS[currentZone]}
            </Text>

            <View style={{ marginVertical: 18 }}>
              <BrushTimer remaining={remaining} total={BRUSHING_DURATION_SECONDS} size={150} />
            </View>

            <Pressable
              onPress={finish}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                paddingHorizontal: 28,
                paddingVertical: 12,
                borderRadius: 999,
              }}
            >
              <Text className="font-subhead" style={{ fontSize: 15, color: '#fff' }}>
                I'm done
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
