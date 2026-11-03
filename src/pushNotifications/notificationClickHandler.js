import {
  getMerchantDetails,
} from "../redux/merchant/merchant-thunks";
import store from "../redux/store";
import i18n from "i18next";
import { setClickedNotificationData } from "../redux/notifications/notifications-actions";
import { navigate } from "../Navigation/RootNavigation";
import { CHARITY_MERCHANT_IDS } from "../constants";
import { handleRedirectScreen } from "../utils/redirectScreen";
import { getOfferById } from "../api/offers";
import { isRTL } from "../../utils";
import trackActivity from "../api/activityTracker";

export const NotificatiionClickHanlder = {
  merchant: (merchant_id) => {
    store.dispatch(setClickedNotificationData(null));
    store.dispatch(getMerchantDetails(merchant_id, null, i18n.t));
  },
  product: async (product_id, notification) => {
    store.dispatch(setClickedNotificationData(notification));

    try {
      const product = await getOfferById(product_id);

      navigate("offer-info", {
        productId: product_id,
        title: isRTL() ? product?.x_arabic_name ?? product?.name : product?.name,
      });
    } catch (err) {
      console.log(err, "get offer by id error");
    } finally {
      store.dispatch(setClickedNotificationData(null));
    }
  },
  charity: (merchantId) => {
    store.dispatch(setClickedNotificationData(null));
    navigate('Charities', { merchantId });
    return
  }
};

// notifee's onForegroundEvent (iOS) has been observed firing PRESS twice for
// a single tap — likely notifee/@react-native-firebase/messaging both
// hooking UNUserNotificationCenterDelegate — so the same notification id
// reaches this funnel twice back to back. De-dupe on id within a short
// window rather than patching native delegate wiring.
let lastHandledKey = null;
let lastHandledAt = 0;
const DEDUPE_WINDOW_MS = 3000;

export const handleNotificationClick = (notification, appState) => {
  console.log('[Push][debug] handleNotificationClick called. appState:', appState, 'notification:', JSON.stringify(notification));

  if (!notification) {
    console.log('[Push][debug] handleNotificationClick bailing — notification arg is falsy');
    return;
  }

  const { data } = notification;
  console.log("handleNotificationClick data:", data)
  if (!data) {
    console.log('[Push][debug] handleNotificationClick bailing — notification.data is falsy');
    return;
  }

  const dedupeKey = notification.messageId || notification.id || JSON.stringify(data);
  const now = Date.now();
  if (dedupeKey && dedupeKey === lastHandledKey && now - lastHandledAt < DEDUPE_WINDOW_MS) {
    console.log('[Push][debug] handleNotificationClick bailing — duplicate event for', dedupeKey, 'within', DEDUPE_WINDOW_MS, 'ms');
    return;
  }
  lastHandledKey = dedupeKey;
  lastHandledAt = now;

  trackActivity("push_notification_click", {
    reference: notification.messageId || notification.id,
    page_name: data.redirectScreen,
    merchant_id: data.merchant_id && data.merchant_id !== "False" ? Number(data.merchant_id) : undefined,
    product_id: data.product_id && data.product_id !== "False" ? Number(data.product_id) : undefined,
    metadata: appState ? { app_state: appState } : undefined,
  });

  if (data.redirectScreen && handleRedirectScreen(data.redirectScreen, navigate)) {
    store.dispatch(setClickedNotificationData(null));
    return;
  }

  if (data.merchant_id && CHARITY_MERCHANT_IDS.includes(+data.merchant_id)) {
    NotificatiionClickHanlder.charity(data.merchant_id);
    return
  }

  if (data.merchant_id && data.merchant_id !== "False") {
    NotificatiionClickHanlder.merchant(Number(data.merchant_id));
    return;
  }

  if (data.product_id && data.product_id !== "False") {
    NotificatiionClickHanlder.product(Number(data.product_id), notification);
  }
};

