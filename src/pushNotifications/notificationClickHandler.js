// src/pushNotifications/notificationClickHandler.js
import { getMerchantDetails } from '../redux/merchant/merchant-thunks';
import store from '../redux/store';
import i18n from 'i18next';
import { setClickedNotificationData } from '../redux/notifications/notifications-actions';
import { openScreen } from '../Navigation/RootNavigation';
import { CHARITY_MERCHANT_IDS } from '../constants';
import { handleRedirectScreen } from '../utils/redirectScreen';
import { getOfferById } from '../api/offers';
import { isRTL } from '../../utils';
import trackActivity from '../api/activityTracker';

export const NotificatiionClickHanlder = {
  merchant: merchant_id => {
    const id = Number(merchant_id);

    store.dispatch(setClickedNotificationData(null));
    store.dispatch(
      getMerchantDetails(id, null, i18n.t),
    );
  },

  product: async (product_id, notification) => {
    const id = Number(product_id);

    store.dispatch(setClickedNotificationData(notification));

    try {
      const productResult = await getOfferById(id);
      const product = Array.isArray(productResult)
        ? productResult[0]
        : productResult;

      openScreen('AllOffers', {
        screen: 'offer-info',
        params: {
          productId: id,
          title: isRTL()
            ? product?.x_arabic_name ?? product?.name
            : product?.name,
        },
      });
    } catch (err) {
      console.log(err, 'get offer by id error');
    } finally {
      store.dispatch(setClickedNotificationData(null));
    }
  },

  charity: merchantId => {
    store.dispatch(setClickedNotificationData(null));
    openScreen('Charities', { merchantId });
  },
};

// notifee's onForegroundEvent (iOS) can fire PRESS twice for a single tap.
let lastHandledKey = null;
let lastHandledAt = 0;
const DEDUPE_WINDOW_MS = 3000;

export const handleNotificationClick = (notification, appState) => {
  if (!notification) {
    return;
  }

  const { data } = notification;
  if (!data) {
    return;
  }

  const dedupeKey =
    notification.messageId || notification.id || JSON.stringify(data);
  const now = Date.now();
  if (
    dedupeKey &&
    dedupeKey === lastHandledKey &&
    now - lastHandledAt < DEDUPE_WINDOW_MS
  ) {
    return;
  }
  lastHandledKey = dedupeKey;
  lastHandledAt = now;

  trackActivity('push_notification_click', {
    reference: notification.messageId || notification.id,
    page_name: data.redirectScreen,
    merchant_id:
      data.merchant_id && data.merchant_id !== 'False'
        ? Number(data.merchant_id)
        : undefined,
    product_id:
      data.product_id && data.product_id !== 'False'
        ? Number(data.product_id)
        : undefined,
    metadata: appState ? { app_state: appState } : undefined,
  });

  if (
    data.redirectScreen &&
    handleRedirectScreen(data.redirectScreen)
  ) {
    store.dispatch(setClickedNotificationData(null));
    return;
  }

  if (data.merchant_id && CHARITY_MERCHANT_IDS.includes(+data.merchant_id)) {
    NotificatiionClickHanlder.charity(data.merchant_id);
    return;
  }

  if (data.merchant_id && data.merchant_id !== 'False') {
    NotificatiionClickHanlder.merchant(data.merchant_id);
    return;
  }

  if (data.product_id && data.product_id !== 'False') {
    NotificatiionClickHanlder.product(data.product_id, notification);
  }
};
