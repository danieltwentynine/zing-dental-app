import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useFaceDetectorOutput, type Face } from 'react-native-vision-camera-face-detector';

import { SafeScreen } from '@/components/ui/SafeScreen';
import { summarize, trim, type DetectionSample, type WindowStats } from '@/lib/spikeStats';

/**
 * THROWAWAY Phase 2 spike (docs/decisions/0002). Option A only: ML Kit face detector.
 * Measures detector callback rate and how often a mouth is found. It does not attribute
 * brushing zones — that is the open question the spike is meant to inform.
 * Dev builds only, not linked from any tab; open it with the deep link `zing://spike/camera`.
 * Frames never leave the device and nothing here stores or logs them or face geometry.
 */
const EMPTY_STATS: WindowStats = { samples: 0, callbacksPerSecond: 0, faceFoundRatio: 0, mouthFoundRatio: 0 };
const STATS_INTERVAL_MS = 500;

function hasMouth(face: Face): boolean {
  const l = face.landmarks;
  return Boolean(l?.MOUTH_BOTTOM && l.MOUTH_LEFT && l.MOUTH_RIGHT);
}

export default function CameraSpikeScreen() {
  if (!__DEV__) {
    return (
      <SafeScreen>
        <Text className="p-6 font-body text-muted">This screen is only available in development builds.</Text>
      </SafeScreen>
    );
  }
  return <SpikeBody />;
}

function SpikeBody() {
  const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const samplesRef = useRef<DetectionSample[]>([]);
  const lastStatsAtRef = useRef(0);
  const [stats, setStats] = useState<WindowStats>(EMPTY_STATS);
  const [pose, setPose] = useState<{ yaw: number; pitch: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFaces = useCallback((faces: Face[]) => {
    const now = Date.now();
    const first = faces[0];
    samplesRef.current = trim([...samplesRef.current, { at: now, faceCount: faces.length, mouthFound: first ? hasMouth(first) : false }], now);
    if (now - lastStatsAtRef.current < STATS_INTERVAL_MS) return;
    lastStatsAtRef.current = now;
    setStats(summarize(samplesRef.current, now));
    setPose(first ? { yaw: first.yawAngle, pitch: first.pitchAngle } : null);
  }, []);

  const handleError = useCallback((e: Error) => setError(e.message), []);

  const faceOutput = useFaceDetectorOutput({
    performanceMode: 'fast',
    runLandmarks: true,
    onFacesDetected: handleFaces,
    onError: handleError,
  });

  if (!hasPermission) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center gap-4 p-6">
          <Text className="font-display text-2xl text-ink">Camera test</Text>
          <Text className="font-body text-base text-muted">
            This developer test uses the front camera to check whether Zing can find a mouth on screen. The picture
            stays on this phone and is never saved or sent anywhere.
          </Text>
          {canRequestPermission ? (
            <Pressable onPress={() => void requestPermission()} className="h-14 items-center justify-center rounded-2xl bg-primary">
              <Text className="font-subhead text-lg text-white">Allow camera</Text>
            </Pressable>
          ) : (
            <Text className="font-body text-muted">Camera access is off. Turn it on in Settings, then come back.</Text>
          )}
        </View>
      </SafeScreen>
    );
  }

  if (!device) {
    return (
      <SafeScreen>
        <Text className="p-6 font-body text-muted">No front camera found on this device.</Text>
      </SafeScreen>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera style={StyleSheet.absoluteFill} device={device} isActive outputs={[faceOutput]} />
      <SafeScreen>
        <View className="m-4 gap-1 self-start rounded-2xl bg-black/60 p-4">
          <Text className="font-numeric text-white">{stats.callbacksPerSecond.toFixed(1)} detector callbacks/s</Text>
          <Text className="font-numeric text-white">face found {Math.round(stats.faceFoundRatio * 100)}%</Text>
          <Text className="font-numeric text-white">mouth landmarks {Math.round(stats.mouthFoundRatio * 100)}%</Text>
          <Text className="font-numeric text-white">
            {pose ? `yaw ${pose.yaw.toFixed(0)}° pitch ${pose.pitch.toFixed(0)}°` : 'no face'}
          </Text>
          {error ? <Text className="font-body text-warning">Detector error: {error}</Text> : null}
        </View>
        <Pressable onPress={() => router.back()} className="absolute bottom-8 self-center rounded-2xl bg-white px-6 py-3">
          <Text className="font-subhead text-ink">Close test</Text>
        </Pressable>
      </SafeScreen>
    </View>
  );
}
