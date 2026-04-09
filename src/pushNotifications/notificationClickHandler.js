// src/pushNotifications/notificationClickHandler.js
import {
  getMerchantDetails,
  getOfferById,
} from '../redux/merchant/merchant-thunks';
import store from '../redux/store';
import i18n from 'i18next';
import { setClickedNotificationData } from '../redux/notifications/notifications-actions';
import { navigate } from '../Navigation/RootNavigation';
import { CHARITY_MERCHANT_IDS } from "../constants";

export const NotificatiionClickHanlder = {
  merchant: merchant_id => {
    const id = Number(merchant_id);

    // очищаем старые данные по уведомлению
    store.dispatch(setClickedNotificationData(null));

    // грузим детали мерчанта (если где-то ещё нужно в сторе)
    store.dispatch(getMerchantDetails(id, null, i18n.t));

    // 🔹 вложенная навигация:
    // Drawer ("Home") -> TabsScreen ("TabsBar") -> MainStack -> MapPage
    navigate('Home', {
      screen: 'TabsBar',
      params: {
        screen: 'MapPage',
        params: { merchantId: id },
      },
    });
  },

  product: (product_id, notification) => {
    const id = Number(product_id);

    store.dispatch(setClickedNotificationData(notification));

    navigate("AllOffers", {
      screen: "offer-info",
      params: {
        productId: id,
        title: ''
      },
    });
    // если нужно открывать экран продукта, сюда тоже можно добавить navigate(...)
  },

  charity: (merchantId) => {
    store.dispatch(setClickedNotificationData(null));
    navigate('Charities', { merchantId });
    return
  }
};

export const handleNotificationClick = notification => {
  if (!notification) {
    return;
  }

  const { data } = notification;

  if (!data) {
    return;
  }

  if (data.merchant_id && CHARITY_MERCHANT_IDS.includes(+data.merchant_id)) {
    NotificatiionClickHanlder.charity(data.merchant_id);
    return
  }

  // иначе пробуем продукт
  if (data.product_id && data.product_id !== 'False') {
    NotificatiionClickHanlder.product(data.product_id, notification);
  }

  // 🧭 если в data есть merchant_id — считаем, что это клик по мерчанту
  if (data.merchant_id && data.merchant_id !== 'False') {
    NotificatiionClickHanlder.merchant(data.merchant_id);
    return;
  }
};
