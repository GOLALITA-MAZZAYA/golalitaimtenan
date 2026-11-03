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
  console.log('[Push][debug] usePushNotifications mounted, platform:', Platform.OS);

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
          id: remoteMessage.messageId,
          title,
          body,
          android: {
            channelId: NOTIFICATION_DEFAULT_CHANNEL_ID,
            pressAction: { id: 'default' },
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
          handleNotificationClick(detail?.notification, 'foreground');
        }
      },
    );

    async function handleInitialNotifeeNotification() {
      console.log('[Push][debug] notifee.getInitialNotification() — checking for a killed-state notifee tap...');
      try {
        const initialNotification = await notifee.getInitialNotification();
        console.log('[Push][debug] notifee.getInitialNotification() raw result:', JSON.stringify(initialNotification));

        if (initialNotification?.notification) {
          console.log(
            'notifee.getInitialNotification',
            initialNotification.notification.data,
          );
          handleNotificationClick(initialNotification.notification, 'killed');
        } else {
          console.log('[Push][debug] notifee.getInitialNotification() returned nothing — this app was not cold-started via a notifee-displayed notification tap.');
        }
      } catch (e) {
        console.log('[Push][debug] Error in getInitialNotification (notifee)', e);
      }
    }

    handleInitialNotifeeNotification();

    return unsubscribeForeground;
  }, []);

  // 🔹 FCM: если система сама показала уведомление (background/killed)
  useEffect(() => {
    async function getInitialNotification() {
      console.log('[Push][debug] messaging().getInitialNotification() — checking for a killed-state system-notification tap...');
      try {
        const message = await messaging().getInitialNotification();
        console.log('[Push][debug] messaging().getInitialNotification() raw result:', JSON.stringify(message));

        if (message) {
          console.log('messaging.getInitialNotification', message.data);
          store.dispatch(setClickedNotificationData(message));
          handleNotificationClick({ data: message.data, messageId: message.messageId }, 'killed');
        } else {
          console.log('[Push][debug] messaging().getInitialNotification() returned null — this app was not cold-started via a system-displayed notification tap.');
        }
      } catch (e) {
        console.log('[Push][debug] Error in messaging.getInitialNotification', e);
      }
    }

    getInitialNotification();

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[Push][debug] messaging.onNotificationOpenedApp fired. data:',
        remoteMessage?.data,
      );
      if (remoteMessage && remoteMessage?.messageId) {
        store.dispatch(setClickedNotificationData(remoteMessage));
        handleNotificationClick({ data: remoteMessage.data, messageId: remoteMessage.messageId }, 'background');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

export default usePushNotifications;
