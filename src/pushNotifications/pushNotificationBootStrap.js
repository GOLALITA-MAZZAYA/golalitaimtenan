// src/pushNotifications/pushNotificationBootStrap.js
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NOTIFICATION_DEFAULT_CHANNEL_ID } from './config';
// handleNotificationClick подключим в другом месте, здесь он не нужен напрямую
// import { handleNotificationClick } from './notificationClickHandler';

messaging().onTokenRefresh(async token => {
  try {
    await AsyncStorage.setItem('deviceToken', token);
    // здесь при желании можно дернуть апи и обновить токен на сервере
    console.log('[Push] Token refreshed:', token);
  } catch (e) {
    console.log('[Push] Error saving device token', e);
  }
});

messaging().onMessage(async remoteMessage => {
  console.log('[Push] FCM onMessage (foreground):', remoteMessage?.data);

  // Если сообщение уже было "сделано" нашим приложением (локальное),
  // не создаём второе уведомление
  if (remoteMessage?.data?.sendedFromApp === 'true') {
    return;
  }

  const data = remoteMessage?.data || {};

  try {
    await notifee.displayNotification({
      title: data.title || '',
      body: data.body || '',
      data: {
        ...data,
        sendedFromApp: 'true', // помечаем, что это локальное уведомление от приложения
      },
      android: {
        channelId: NOTIFICATION_DEFAULT_CHANNEL_ID,
        pressAction: { id: 'default' },
        smallIcon: 'icon', // убедись, что такой иконки нетривиально существует
      },
    });
  } catch (e) {
    console.log('[Push] Error displaying notification with notifee', e);
  }
});
