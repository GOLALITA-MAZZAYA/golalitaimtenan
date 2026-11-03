// src/pushNotifications/pushNotificationBootStrap.js
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../redux/store';
import authApi from '../redux/auth/auth-api';
// handleNotificationClick подключим в другом месте, здесь он не нужен напрямую
// import { handleNotificationClick } from './notificationClickHandler';

messaging().onTokenRefresh(async token => {
  try {
    await AsyncStorage.setItem('deviceToken', token);
    console.log('[Push] Token refreshed:', token);

    // Only a logged-in session has a userId to attach the token to; a
    // refresh while logged out is already covered by login() reading
    // deviceToken from AsyncStorage on the next sign-in.
    const { token: authToken, userId } = store.getState().authReducer;
    if (authToken && userId) {
      await authApi.updateProfile(userId, {
        params: {
          token: authToken,
          update_vals: JSON.stringify({
            device_id: token,
            expo_token: token,
            device_token: token,
          }),
        },
      });
    }
  } catch (e) {
    console.log('[Push] Error saving refreshed device token', e);
  }
});

// Foreground display is handled in usePushNotifications.js's own onMessage
// listener — a second one here duplicated every notification (two separate
// notifee entries per push, and downstream double click-tracking).

// Required by index.js's AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', ...)
// — Android invokes this for messages received while the app is backgrounded
// or killed. Must be registered for background/killed delivery to work at
// all; a missing/undefined handler throws when Android tries to invoke it.
export const firebaseBackgroundMessage = async remoteMessage => {
  console.log('[Push] Background/killed message handled:', remoteMessage?.data);
};
