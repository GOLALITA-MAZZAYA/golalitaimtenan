// App.jsx
import React from 'react';
import { I18nManager } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import Geocoder from 'react-native-geocoding';
import { QueryClient, QueryClientProvider } from 'react-query';
// import Geolocation from 'react-native-geolocation-service';

import store from './src/redux/store';
import { ThemeProvider, useTheme } from './src/components/ThemeProvider';
import ErrorBoundary from './src/components/ErrorBoundary';

import { Root } from './src/Navigation/Root';
import UpdateModal from './src/components/UpdateModal';
import SplashScreenModal from './src/components/SplashScreenModal';
import PortalProvider from './src/components/Portal/PortalProvider';
import { colors } from './src/components/colors';

import './src/languages/index';
import { useSecurityCheck } from './src/utils/deviceSecurityCheck';
import { useScreenSecurity } from './src/hooks/useScreenSecurity';
import PrivacyOverlay from './src/components/PrivacyOverlay';

import usePushNotifications from './src/pushNotifications/usePushNotifications';
import { useAppStartup } from './src/hooks/useAppStartup';
import { useAppUpdateCheck } from './src/hooks/useAppUpdateCheck';
import { useAppStatusGate } from './src/hooks/useAppStatusGate';

I18nManager.allowRTL(false);

const queryClient = new QueryClient();

Geocoder.init('AIzaSyAQdSJ757bWixdQLltgkgVNhqTWMfiSP1o', {
  language: 'en', interpolation: {
    escapeValue: false
  }
});

const App = () => {
  const { isDark } = useTheme();

  const user = useSelector(state => state.authReducer.user);
  const workStatus = useSelector(state => state.authReducer.workStatus);
  const version = useSelector(state => state.authReducer.version);
  const isAuthorized = useSelector(state => state.authReducer.isAuthorized);
  const isSplashScreenVisible = useSelector(
    state => state.authReducer.isSplashScreenVisible,
  );

  usePushNotifications();
  useSecurityCheck();

  // Protection is unconditional — every screen, from the first frame. The
  // hook retries internally if the native call fires too early in boot.
  // useScreenSecurity(true);

  const { isReady } = useAppStartup({ user, isAuthorized });
  const { updateModal, setUpdateModal } = useAppUpdateCheck({ isReady, version });
  useAppStatusGate({ isReady, workStatus });

  return (
    <>
      {isAuthorized !== null && isReady && <Root isAuthorized={isAuthorized} />}
      {updateModal && isReady && (
        <UpdateModal
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          version={version}
        />
      )}
      <FlashMessage
        position="center"
        style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
        titleStyle={{ color: isDark ? colors.white : colors.darkBlue }}
      />
      <SplashScreenModal isVisible={isSplashScreenVisible} />
      <PrivacyOverlay />
    </>
  );
};

const AppWrapper = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PortalProvider>
              <App />
            </PortalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
