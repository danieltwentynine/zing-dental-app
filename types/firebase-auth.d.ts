// The firebase/auth React Native build exports getReactNativePersistence at runtime,
// but the wrapper package's web typings omit it. Remove once the SDK ships RN types.
import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
