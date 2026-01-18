// src/geofence/startNativeGeofenceService.js
import { NativeModules, Platform } from 'react-native';

const MODULE_NAME = 'GeofenceStarter'; // так мы потом назовём native-модуль

const GeofenceStarter = NativeModules[MODULE_NAME];

export function startNativeGeofenceService() {
  if (Platform.OS !== 'android') {
    console.log('[Geofence] native service only for Android');
    return;
  }

  if (!GeofenceStarter || typeof GeofenceStarter.startService !== 'function') {
    console.log('[Geofence] Native module GeofenceStarter not linked');
    return;
  }

  try {
    GeofenceStarter.startService();
    console.log('[Geofence] startService called');
  } catch (e) {
    console.log('[Geofence] error calling native startService', e);
  }
}
