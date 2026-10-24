import { StyleSheet, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';

/**
 * Live front-camera preview behind the session UI. Preview only: no photo,
 * video or frame output is attached, so nothing can be stored or uploaded.
 * The scrim keeps the white timer and hints readable over any room.
 */
export function CameraBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Camera style={StyleSheet.absoluteFill} device="front" isActive resizeMode="cover" orientationSource="interface" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,28,32,0.55)' }]} />
    </View>
  );
}
