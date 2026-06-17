import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Sparkle, X } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrushTimer } from '@/components/brushing/BrushTimer';
import { MouthMap, MOUTH_ZONES, type ZoneState } from '@/components/brushing/MouthMap';
import { buildCoachMessage } from '@/lib/coach';
import { BRUSHING_DURATION_SECONDS, COUNTDOWN_SECONDS } from '@/lib/constants';
import { saveSession } from '@/lib/sessions';
import { tokens } from '@/lib/tokens';
import { useAuthStore } from '@/stores/authStore';
import { useChildStore } from '@/stores/childStore';
import { useSessionStore } from '@/stores/sessionStore';
import type { ToothZone } from '@/types';

// Guide order ends with the back teeth, so stopping early leaves them un-brushed
// — exactly the "reach your back teeth" coaching moment from the design.
const GUIDE_ORDER: ToothZone[] = [
  'top-front', 'top-left', 'top-right', 'top-back-left', 'top-back-right',
  'bottom-front', 'bottom-left', 'bottom-right', 'bottom-back-left', 'bottom-back-right',
];

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
  const user = useAuthStore((s) => s.user);
  const child = useChildStore((s) => s.activeChild);
  const setLastResult = useSessionStore((s) => s.setLastResult);

  const [phase, setPhase] = useState<'countdown' | 'active'>('countdown');
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [remaining, setRemaining] = useState(BRUSHING_DURATION_SECONDS);
  const [states, setStates] = useState<Partial<Record<ToothZone, ZoneState>>>({});
  const stepRef = useRef(0);
  const remainingRef = useRef(BRUSHING_DURATION_SECONDS);
  const finishedRef = useRef(false);
  const childName = child?.name ?? 'friend';

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

  // Active session — a 2-minute guided walk through every zone.
  useEffect(() => {
    if (phase !== 'active') return;
    const total = BRUSHING_DURATION_SECONDS;
    const interval = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        remainingRef.current = next;
        const elapsed = total - next;
        const idx = Math.floor((elapsed / total) * GUIDE_ORDER.length);
        if (idx !== stepRef.current) {
          stepRef.current = idx;
          setStates(() => {
            const ns: Partial<Record<ToothZone, ZoneState>> = {};
            for (let i = 0; i < idx; i++) ns[GUIDE_ORDER[i]] = 'done';
            if (idx < GUIDE_ORDER.length) ns[GUIDE_ORDER[idx]] = 'active';
            return ns;
          });
        }
        if (next <= 0) {
          clearInterval(interval);
          finish();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const reached = Math.min(stepRef.current, GUIDE_ORDER.length);
    const final: Partial<Record<ToothZone, ZoneState>> = {};
    const missed: ToothZone[] = [];
    GUIDE_ORDER.forEach((z, i) => {
      if (i < reached) {
        final[z] = 'done';
      } else {
        final[z] = 'missed';
        missed.push(z);
      }
    });

    const done = reached;
    const score = Math.round((done / MOUTH_ZONES.length) * 100);
    const elapsed = BRUSHING_DURATION_SECONDS - remainingRef.current;
    const coachMessage = buildCoachMessage(childName, missed, score);
    const coverage: Record<string, number> = {};
    MOUTH_ZONES.forEach((z) => {
      coverage[z] = final[z] === 'done' ? 100 : 0;
    });

    setLastResult({
      score,
      zoneStates: final,
      missed,
      durationSeconds: Math.max(0, elapsed),
      coachMessage,
    });

    if (user && child) {
      void saveSession({
        childId: child.id,
        parentUid: user.uid,
        durationSeconds: Math.max(0, elapsed),
        zonesDetected: GUIDE_ORDER.slice(0, done),
        zonesCoverage: coverage,
        score,
        coachMessage,
        streak: child.streakCurrent,
      });
    }

    setTimeout(() => router.replace('/results'), 350);
  };

  const currentZone = GUIDE_ORDER[Math.min(stepRef.current, GUIDE_ORDER.length - 1)];

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
              <MouthMap states={states} size={260} />
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
              <Text className="font-display" style={{ fontSize: 15, color: '#fff' }}>
                I'm done
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
