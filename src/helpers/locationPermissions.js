// src/helpers/locationPermissions.js
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Возвращает:
 *  - 'granted'  — если у нас есть хотя бы foreground (до Android 10)
 *                 и foreground + background (Android 10+)
 *  - 'denied'   — если пользователь отказал
 */
export async function requestLocationPermission() {
  // iOS – сейчас не трогаем (обычно через Info.plist и отдельные либы),
  // просто считаем, что если дошли сюда – всё ок.
  if (Platform.OS === 'ios') {
    return 'granted';
  }

  try {
    // 1) Сначала обычная геолокация (foreground)
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message:
          'We use your location to show nearby offers and partners, even when the app is not active.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('[Geofence] fine location denied:', fine);
      return 'denied';
    }

    // 2) Android 10+ — отдельный запрос на фон
    if (Platform.Version >= 29) {
      const bg = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Allow location in background',
          message:
            'To notify you about nearby offers even when the app is closed, allow background location access.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      if (bg === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[Geofence] background location granted');
        return 'granted';
      } else {
        console.log('[Geofence] background location NOT granted:', bg);
        return 'denied';
      }
    }

    // Android < 10 — отдельного background-разрешения нет
    console.log('[Geofence] fine location granted (no separate background)');
    return 'granted';
  } catch (e) {
    console.log('[Geofence] requestLocationPermission error', e);
    return 'denied';
  }
}
