# Camera spike (ADR 0002)

Throwaway test screen for **option A** only: VisionCamera 5 + the ML Kit face detector plugin. It answers "can we find the mouth, how fast, and how reliably?" It does **not** attribute brushing zones. Options B and C (MediaPipe hand and face landmarkers, toothbrush detection) still need their own spikes, and zone attribution is the real open question.

## What was built (branch `claude/camera-spike`)
- `app/spike/camera.tsx` — dev-only screen (`__DEV__` guard), not linked from any tab. Front camera, detector overlay with callbacks/s, face-found %, mouth-landmarks %, yaw and pitch.
- `lib/spikeStats.ts` + `lib/spikeStats.check.mjs` — rolling-window metrics. Counts and timestamps only; no frames or face geometry are kept or logged.
- `app.json` — `NSCameraUsageDescription` (the parent-facing explanation). VisionCamera 5 ships no Expo config plugin that I could find, so it is set in `infoPlist`.
- Deps: `react-native-vision-camera`, `react-native-vision-camera-worklets`, `react-native-nitro-modules`, `react-native-nitro-image`, `react-native-vision-camera-face-detector`.

## What was verified, and what was not
Verified in CI-like checks on Linux: `tsc` clean, all `lib/*.check.mjs` pass, an iOS JS bundle exports, and `expo prebuild --platform ios` writes the camera permission string into `Info.plist`.

**Not verified (needs a Mac and a physical iPhone):** `pod install`, the native build (Nitro autolinking, `useFrameworks: static` interaction), runtime behaviour, frame rate and detection quality. `react-native-vision-camera-face-detector`'s README example imports `react-native-worklets-core`, which this project doesn't use; the screen uses the plugin's `useFaceDetectorOutput` hook instead, which is untested here.

## How to run
```bash
npm ci
npx expo run:ios --device        # development build on a physical iPhone
# then open the deep link:  zing://spike/camera
```
Use a **physical device**: the plugin's README says Google ships no arm64 simulator slice for ML Kit, so face detection may not work in the iOS simulator (the plugin's README, which I haven't tested).

## What option A can and cannot tell us
From the plugin's types: a face box, head yaw/pitch/roll, three mouth landmarks (bottom, left, right), optional contours, and eye/smile probabilities. There is **no hand or toothbrush information**, so option A alone can locate the mouth and head pose but cannot say which teeth are being brushed.

## Record results here
Adults first; children only with parent consent and no stored footage. Pass criteria are the starting guesses in ADR 0002 until the owner and clinical advisor set real ones.

| Date | Device / iOS | Scenario (distance, brush in mouth?) | callbacks/s | face % | mouth % | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |
