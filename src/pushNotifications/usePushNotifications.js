// src/pushNotifications/usePushNotifications.js
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_DEFAULT_CHANNEL_ID } from './config';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import store from '../redux/store';
import { setClickedNotificationData } from '../redux/notifications/notifications-actions';
import { handleNotificationClick } from './notificationClickHandler';

export async function requestNotificationPermissions() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission status:', authStatus);
    }

    // Android 13+ runtime permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Notification permission not granted');
      }
    }

    await notifee.requestPermission();

    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: NOTIFICATION_DEFAULT_CHANNEL_ID,
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  } catch (err) {
    console.log(err, 'requestNotificationPermissions');
  }
}

export async function getFcmToken() {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    console.log(token, 'fcm token');
    if (!token) {
      console.log('Failed to get FCM token');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

const usePushNotifications = () => {
  // 🔹 Настройка FCM, разрешений и сохранение токена
  useEffect(() => {
    async function setupFCM() {
      await requestNotificationPermissions();
      const token = await getFcmToken();

      if (token) {
        await AsyncStorage.setItem('deviceToken', token);
        console.log('Current FCM token:', token);
      }
    }

    setupFCM();
  }, []);

  // 🔹 Foreground-пуши: показываем уведомление сами
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        console.log(
          '[FCM] onMessage foreground data:',
          remoteMessage?.data,
          'notification:',
          remoteMessage?.notification,
        );

        const data = remoteMessage.data || {};
        const title =
          remoteMessage.notification?.title ||
          data.title ||
          'Nearby offer';
        const body =
          remoteMessage.notification?.body ||
          data.body ||
          'You are near one of our partners';

        // показываем локальное уведомление через Notifee
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: NOTIFICATION_DEFAULT_CHANNEL_ID,
            pressAction: { id: 'default' },
            smallIcon: 'ic_notification',
            color: '#8D1B3D',
          },
          data,
        });
      } catch (e) {
        console.log('Error in messaging.onMessage handler', e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 🔹 Обработка кликов по notifee-уведомлениям (foreground + initial)
  useEffect(() => {
    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        console.log(
          'notifee.onForegroundEvent',
          type,
          detail?.notification?.data,
        );
        if (type === EventType.PRESS) {
          handleNotificationClick(detail?.notification);
        }
      },
    );

    async function handleInitialNotifeeNotification() {
      try {
        const initialNotification = await notifee.getInitialNotification();

        if (initialNotification?.notification) {
          console.log(
            'notifee.getInitialNotification',
            initialNotification.notification.data,
          );
          handleNotificationClick(initialNotification.notification);
        }
      } catch (e) {
        console.log('Error in getInitialNotification (notifee)', e);
      }
    }

    handleInitialNotifeeNotification();

    return unsubscribeForeground;
  }, []);

  // 🔹 FCM: если система сама показала уведомление (background/killed)
  useEffect(() => {
    async function getInitialNotification() {
      try {
        const message = await messaging().getInitialNotification();

        if (message) {
          console.log('messaging.getInitialNotification', message.data);
          store.dispatch(setClickedNotificationData(message));
          handleNotificationClick({ data: message.data });
        }
      } catch (e) {
        console.log('Error in messaging.getInitialNotification', e);
      }
    }

    getInitialNotification();

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'messaging.onNotificationOpenedApp',
        remoteMessage?.data,
      );
      if (remoteMessage && remoteMessage?.messageId) {
        store.dispatch(setClickedNotificationData(remoteMessage));
        handleNotificationClick({ data: remoteMessage.data });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

export default usePushNotifications;
