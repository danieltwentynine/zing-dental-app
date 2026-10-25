import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

/**
 * Live front-camera preview behind the session UI. Preview only: no photo,
 * video or frame output is attached, so nothing can be stored or uploaded.
 * The scrim keeps the white timer and hints readable over any room.
 * Renders nothing without a front camera (e.g. the iOS simulator).
 */
export function CameraBackdrop() {
  const device = useCameraDevice('front');
  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Camera style={StyleSheet.absoluteFill} device={device} isActive resizeMode="cover" orientationSource="interface" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(18,31,94,0.55)' }]} />
    </View>
  );
}
