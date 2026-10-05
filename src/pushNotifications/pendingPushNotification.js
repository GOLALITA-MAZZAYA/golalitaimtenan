import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Survives Metro's slow cold-start / activity recreation on debug builds:
// getInitialNotification is one-shot and often returns null if read too early
// or after a remount. Persist the first successful capture to AsyncStorage.
const STORAGE_KEY = '@pending_push_notification_v1';

let memoryCache = null;
let capturePromise = null;

const normalizePayload = (raw) => {
  if (!raw) return null;

  // FCM RemoteMessage
  if (raw.data || raw.messageId) {
    if (!raw.data || typeof raw.data !== 'object') return null;
    return {
      data: raw.data,
      messageId: raw.messageId || raw.message_id || raw.id,
    };
  }

  // Notifee notification object (already has .data)
  if (raw.notification?.data || raw.data) {
    const notification = raw.notification || raw;
    return {
      data: notification.data || {},
      messageId: notification.id || raw.id,
      id: notification.id,
    };
  }

  return null;
};

const persist = async (payload) => {
  if (!payload?.data) return;
  memoryCache = payload;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore storage failures — memory cache still helps same session
  }
};

/**
 * Start capturing as early as possible (call from index.js).
 * Retries briefly — on Android + Metro, the opening intent is sometimes
 * not ready on the first tick after JS loads.
 */
export const startInitialNotificationCapture = () => {
  if (capturePromise) return capturePromise;

  capturePromise = (async () => {
    // Register background press ASAP (killed / background notifee taps).
    try {
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS && detail?.notification) {
          await persist(normalizePayload(detail.notification));
        }
      });
    } catch (e) {
      // notifee may throw if native module not ready yet
    }

    const attempts = 8;
    for (let i = 0; i < attempts; i++) {
      try {
        const [fcm, notifeeInitial] = await Promise.all([
          messaging().getInitialNotification(),
          notifee.getInitialNotification(),
        ]);

        const fromFcm = normalizePayload(fcm);
        const fromNotifee = normalizePayload(notifeeInitial);

        const payload = fromFcm || fromNotifee;
        if (payload) {
          await persist(payload);
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[Push] cold-start notification captured', payload.data);
          }
          return payload;
        }
      } catch (e) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[Push] cold-start capture attempt failed', e?.message || e);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    // Fall back to anything persisted by a previous background press.
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryCache = JSON.parse(raw);
        return memoryCache;
      }
    } catch (e) {
      // ignore
    }

    return null;
  })();

  return capturePromise;
};

/**
 * Returns and clears the pending cold-start notification (memory + storage).
 */
export const consumePendingNotification = async () => {
  await startInitialNotificationCapture();

  if (memoryCache) {
    const value = memoryCache;
    memoryCache = null;
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    return value;
  }

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

/**
 * Peek without clearing — useful while waiting for MainScreen.
 */
export const peekPendingNotification = async () => {
  if (memoryCache) return memoryCache;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
