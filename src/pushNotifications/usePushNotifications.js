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
import {
  consumePendingNotification,
  startInitialNotificationCapture,
} from './pendingPushNotification';

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

const hydrateColdStartNotification = async () => {
  startInitialNotificationCapture();
  const pending = await consumePendingNotification();
  if (pending?.data) {
    store.dispatch(setClickedNotificationData(pending));
    handleNotificationClick({
      data: pending.data,
      messageId: pending.messageId,
      id: pending.id,
    });
  }
};

const usePushNotifications = () => {
  // Must live at App/Root level, not Login: Login unmounts when isAuthorized
  // flips true, which would tear down every push listener for the session.
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
    hydrateColdStartNotification();
  }, []);

  // Foreground pushes: display via Notifee (system does not show them)
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

  // Notifee click handling (foreground)
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

    return unsubscribeForeground;
  }, []);

  // FCM: background open (app was collapsed, not killed)
  useEffect(() => {
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
