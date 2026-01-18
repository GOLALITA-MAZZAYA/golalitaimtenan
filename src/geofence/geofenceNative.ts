// src/geofence/geofenceNative.ts
import { NativeModules, Platform } from 'react-native';

const { GeofenceNative } = NativeModules;

type GeofencePoint = {
  id: string | number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

/**
 * Передаём в native userId + fcmToken.
 * Вызывать после того, как у нас есть:
 *  - userId (из бэка)
 *  - fcmToken (из Firebase)
 */
export const setGeofenceAuthData = async (
  userId: number,
  fcmToken: string,
): Promise<void> => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

  if (!GeofenceNative || !GeofenceNative.setAuthData) {
    console.log(
      '[GeofenceNative] setAuthData not available',
      GeofenceNative,
    );
    return;
  }

  try {
    console.log('[GeofenceNative] calling setAuthData', userId);
    await GeofenceNative.setAuthData(Number(userId), String(fcmToken || ''));
  } catch (e) {
    console.log('[GeofenceNative] setAuthData error', e);
  }
};

/**
 * Регистрируем геозоны в native.
 * Android: до 90 ближайших.
 * iOS: внутри native можно оставить только 20 ближайших (если понадобится).
 */
export const registerNativeGeofences = async (
  points: GeofencePoint[],
  radiusMeters: number = 150,
): Promise<void> => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

  if (!GeofenceNative || !GeofenceNative.registerMerchants) {
    console.log(
      '[GeofenceNative] registerMerchants not available',
      GeofenceNative,
    );
    return;
  }

  if (!Array.isArray(points) || !points.length) {
    console.log('[GeofenceNative] no points to register');
    return;
  }

  const normalizedPoints = points
    .map(p => {
      const lat = Number(p.lat ?? p.latitude);
      const lng = Number(p.lng ?? p.longitude);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      return {
        id: String(p.id),
        lat,
        lng,
        latitude: lat,
        longitude: lng,
      };
    })
    .filter(Boolean) as {
    id: string;
    lat: number;
    lng: number;
    latitude: number;
    longitude: number;
  }[];

  if (!normalizedPoints.length) {
    console.log('[GeofenceNative] normalizedPoints is empty');
    return;
  }

  try {
    console.log(
      '[GeofenceNative] calling registerMerchants, count =',
      normalizedPoints.length,
      'radius =',
      radiusMeters,
    );
    await GeofenceNative.registerMerchants(normalizedPoints, radiusMeters);
  } catch (e) {
    console.log('[GeofenceNative] registerMerchants error', e);
  }
};
