import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { navigate, navigateDeep, navigationRef } from '../Navigation/RootNavigation';

export const useDeepLinking = () => {
  const [pendingURL, setPendingURL] = useState(null);

  const handleDeepLink = url => {
    if (!url) return;
    const parsed = parseURL(url);

    if (!parsed) return;

    const { screen, params } = parsed;

    if (navigationRef.isReady()) {
      // Push onto MainStack so back returns to the previous screen.
      if (screen === 'charities') {
        navigateDeep('Charities', params);
        return;
      }

      if (screen === 'giftcards' || screen === 'giftcard') {
        navigateDeep('myVouchers', {
          screen: 'myVouchers-list',
          params: { selectedPage: '1', ...params },
        });
        return;
      }

      if (screen === 'vouchers') {
        navigateDeep('myVouchers', {
          screen: 'myVouchers-list',
          params: { selectedPage: '0', ...params },
        });
        return;
      }

      if (screen === 'home') {
        navigate('Main');
        return;
      }

      navigateDeep(screen, params);
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

    if (screen === 'charities') {
      navigateDeep('Charities', params);
      return;
    }
    if (screen === 'giftcards' || screen === 'giftcard') {
      navigateDeep('myVouchers', {
        screen: 'myVouchers-list',
        params: { selectedPage: '1', ...params },
      });
      return;
    }
    if (screen === 'vouchers') {
      navigateDeep('myVouchers', {
        screen: 'myVouchers-list',
        params: { selectedPage: '0', ...params },
      });
      return;
    }
    if (screen === 'home') {
      navigate('Main');
      return;
    }

    navigateDeep(screen, params);
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
        params[key] = value;
      });
    }

    return { screen, params };
  } catch (e) {
    console.log('Invalid deep link:', e);
    return null;
  }
};
