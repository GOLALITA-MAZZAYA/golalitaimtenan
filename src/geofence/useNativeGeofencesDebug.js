// src/geofence/useNativeGeofencesDebug.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  registerNativeGeofences,
} from './geofenceNative';

export function useNativeGeofencesDebug(hasLocationPermission, user) {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      console.log('[GeofenceDebug] not Android, skip native geofences');
      return;
    }

    if (!hasLocationPermission) {
      console.log('[GeofenceDebug] no location permission, skip');
      return;
    }

    if (!user) {
      console.log('[GeofenceDebug] no user, skip');
      return;
    }

    async function run() {
      try {
        console.log('[GeofenceDebug] start loading merchants for native geofences');

        const res = await fetch(
          'https://wallet-backend-golalita.vercel.app/api/merchants/local',
        );

        if (!res.ok) {
          console.log(
            '[GeofenceDebug] failed to load merchants, status =',
            res.status,
          );
          return;
        }

        const merchants = await res.json();

        const normalized = merchants
          .filter(
            m =>
              m &&
              m.lat != null &&
              m.long != null &&
              !Number.isNaN(m.lat) &&
              !Number.isNaN(m.long),
          )
          .map(m => ({
            id: String(m.id),
            lat: m.lat,
            lng: m.long,
          }));

        console.log(
          '[GeofenceDebug] merchants normalized length =',
          normalized.length,
        );

        if (!normalized.length) {
          console.log('[GeofenceDebug] no valid merchants, skip register');
          return;
        }

        console.log(
          '[GeofenceDebug] calling registerNativeGeofences, count =',
          normalized.length,
        );

        await registerNativeGeofences(normalized, 150);
        console.log('[GeofenceDebug] registerNativeGeofences finished');
      } catch (e) {
        console.log('[GeofenceDebug] error in native geofences', e);
      }
    }

    run();
  }, [hasLocationPermission, user?.id]);
}
