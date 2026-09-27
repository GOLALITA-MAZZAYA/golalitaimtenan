import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { goHome, openScreen, navigationRef } from '../Navigation/RootNavigation';
import store from '../redux/store';
import { getMerchantDetails } from '../redux/merchant/merchant-thunks';
import i18n from 'i18next';

/**
 * Custom deep-link handler (scheme golalitaimtenanrewards://).
 * Always uses openScreen / goHome so back behavior matches notifications
 * and home banner opens. Complements RN linking config in config.js.
 */
export const useDeepLinking = () => {
  const [pendingURL, setPendingURL] = useState(null);

  const openFromDeepLink = (screen, params) => {
    if (screen === 'home' || screen === 'Main') {
      goHome();
      return;
    }

    if (screen === 'charities' || screen === 'Charities') {
      openScreen('Charities', params);
      return;
    }

    if (screen === 'giftcards' || screen === 'giftcard') {
      openScreen('myVouchers', {
        screen: 'myVouchers-list',
        params: { selectedPage: '1', ...params },
      });
      return;
    }

    if (screen === 'vouchers') {
      openScreen('myVouchers', {
        screen: 'myVouchers-list',
        params: { selectedPage: '0', ...params },
      });
      return;
    }

    // offers / offers/info → AllOffers → offer-info
    if (screen === 'offers' || screen === 'offers/info') {
      if (params?.productId || params?.product_id || screen === 'offers/info') {
        openScreen('AllOffers', {
          screen: 'offer-info',
          params: {
            ...params,
            productId: Number(params.productId || params.product_id) || params.productId,
          },
        });
        return;
      }
      openScreen('AllOffers');
      return;
    }

    // merchant / merchant/info — fetch details then open (same as notifications)
    if (screen === 'merchant' || screen === 'merchant/info') {
      const merchantId = Number(
        params?.merchant_id || params?.merchantId || params?.id,
      );
      if (merchantId) {
        store.dispatch(getMerchantDetails(merchantId, null, i18n.t));
        return;
      }
      openScreen('merchant', {
        screen: 'merchant-info',
        params,
      });
      return;
    }

    if (screen === 'ar' || screen === 'ar/howto') {
      openScreen('ARMap', { screen: 'ARHowToUse', params });
      return;
    }

    if (screen === 'ar/merchants') {
      openScreen('ARMap', { screen: 'ARMerchants', params });
      return;
    }

    if (screen === 'map') {
      openScreen('MapPage', params);
      return;
    }

    if (screen === 'notifications') {
      openScreen('Notifications', params);
      return;
    }

    openScreen(screen, params);
  };

  const handleDeepLink = url => {
    if (!url) return;
    const parsed = parseURL(url);

    if (!parsed) return;

    const { screen, params } = parsed;

    if (navigationRef.isReady()) {
      openFromDeepLink(screen, params);
    } else {
      setPendingURL({ screen, params });
    }
  };

  useEffect(() => {
    const getInitial = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink(url);
    };

    getInitial();

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!pendingURL || !navigationRef.isReady()) {
      return;
    }

    const { screen, params } = pendingURL;
    setPendingURL(null);
    openFromDeepLink(screen, params);
  }, [pendingURL]);
};

const parseURL = url => {
  try {
    const withoutScheme = url.replace(/^golalitaimtenanrewards:\/\//, '');
    const [pathPart, queryPart] = withoutScheme.split('?');

    const screen = pathPart;

    const params = {};
    if (queryPart) {
      queryPart.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value ?? '');
      });
    }

    return { screen, params };
  } catch (e) {
    console.log('Invalid deep link:', e);
    return null;
  }
};
