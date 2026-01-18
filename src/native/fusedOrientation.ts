import { NativeModules, NativeEventEmitter, Platform } from "react-native";

type RNFusedOrientationType = {
  start: (periodMs: number) => Promise<void>;
  stop: () => void;
  addListener?: (eventName: string) => void;
  removeListeners?: (count: number) => void;
};

const Native: RNFusedOrientationType =
  (NativeModules as any).RNFusedOrientation ?? {};

const emitter =
  Platform.OS === "android"
    ? new NativeEventEmitter(Native as any) // модуль теперь имеет addListener/removeListeners
    : null;

export type FOPEvent = { heading: number; accuracy?: number };

export function startFOP(onUpdate: (e: FOPEvent) => void, periodMs = 20) {
  if (Platform.OS !== "android" || !Native?.start || !emitter) {
    // Android-только, на iOS оставляем твой fallback
    return { stop: () => {} };
  }
  const sub = emitter.addListener("FOP_HEADING", onUpdate);
  Native.start(periodMs).catch(() => {});
  return { stop: () => { sub.remove(); Native.stop(); } };
}
