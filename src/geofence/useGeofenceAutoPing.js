// src/geofence/useGeofenceAutoPing.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { sendGeofencePing } from '../api/geofence';
import { requestLocationPermission } from '../helpers/locationPermissions';

const useGeofenceAutoPing = () => {
  const user = useSelector(state => state.authReducer.user);

  useEffect(() => {
    console.log('[Geofence] useGeofenceAutoPing hook render, user =', user);

    // берём partner_id как userId, если нет - другие варианты
    const userId =
      user?.partner_id ??
      user?.id ??
      user?.userId ??
      user?.user_id ??
      user?.uid ??
      null;

    console.log('[Geofence] resolved userId =', userId);

    if (!userId) {
      console.log('[Geofence] no userId, skip auto ping');
      return;
    }

    let watchId = null;
    let isMounted = true;

    const startWatch = async () => {
      // 1) права на геолокацию (foreground + background)
      const status = await requestLocationPermission();
      console.log(
        '[Geofence] location permission status =',
        status,
        'Platform.Version =',
        Platform.Version,
      );

      if (status !== 'granted') {
        console.log('[Geofence] location not granted, skip');
        return;
      }

      // 2) FCM токен
      const fcmToken = await AsyncStorage.getItem('deviceToken');
      console.log('[Geofence] loaded fcmToken =', fcmToken);

      if (!fcmToken) {
        console.log('[Geofence] no FCM token, skip');
        return;
      }

      // 3) стабильный deviceId (сохраняем в AsyncStorage один раз)
      let deviceId = await AsyncStorage.getItem('geofenceDeviceId');
      if (!deviceId) {
        deviceId = `dev-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;
        await AsyncStorage.setItem('geofenceDeviceId', deviceId);
      }
      console.log('[Geofence] deviceId =', deviceId);

      // 4) следим за позицией и шлём пинги на бэк
      console.log('[Geofence] calling Geolocation.watchPosition...');
      watchId = Geolocation.watchPosition(
        async position => {
          if (!isMounted) return;

          const { latitude, longitude } = position.coords;
          console.log('[Geofence] new position', latitude, longitude);

          try {
            const res = await sendGeofencePing({
              userId, // partner_id / id
              deviceId,
              fcmToken,
              lat: latitude,
              lng: longitude,
            });

            console.log('[Geofence] ping result', res);
          } catch (e) {
            console.log('[Geofence] ping error', e);
          }
        },
        error => {
          console.log('[Geofence] watchPosition error', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,       // пинги даже без движения
          interval: 30000,         // целимся в 30 секунд
          fastestInterval: 30000,  // не чаще 30 сек
          showsBackgroundLocationIndicator: Platform.OS === 'ios',
        },
      );
    };

    startWatch();

    return () => {
      isMounted = false;
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [user]); // зависим от user целиком
};

export default useGeofenceAutoPing;
