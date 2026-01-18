// App.jsx
import React, { useEffect, useState } from 'react';
import { BackHandler, I18nManager, Platform } from 'react-native';
import { Provider, connect, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import FlashMessage from 'react-native-flash-message';
import Geocoder from 'react-native-geocoding';
import { QueryClient, QueryClientProvider } from 'react-query';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import Geolocation from 'react-native-geolocation-service';

import store from './src/redux/store';
import { ThemeProvider, useTheme } from './src/components/ThemeProvider';
import {
  getAppStatus,
  getInitialData,
  getVersion,
} from './src/redux/auth/auth-thunks';
import { APP_DISABLED } from './src/redux/auth/auth-types';
import { VERSION } from './src/redux/types';
import { setIsAuthorized } from './src/redux/auth/auth-actions';

import { Root } from './src/Navigation/Root';
import UpdateModal from './src/components/UpdateModal';
import SplashScreenModal from './src/components/SplashScreenModal';
import RedirectToStoresModal, {
  STORES_CONFIG,
} from './src/components/RedirectToStoresModal';
import PortalProvider from './src/components/Portal/PortalProvider';
import { colors } from './src/components/colors';

import './src/languages/index';
import { resetImageCacheDate } from './src/api/asyncStorage';
import { checkIfTokenIsValid } from './src/api/auth';
import { initializeGlobalTixToken } from './src/redux/globalTix/globalTix-api';
import { getKeyHashes } from './src/api/ssl';

import usePushNotifications from './src/pushNotifications/usePushNotifications';

// JS-обёртка над нативным модулем геофенсов (Android + iOS)
import {
  setGeofenceAuthData,
  registerNativeGeofences,
  testNativeGeofence,
} from './src/geofence/geofenceNative';

import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

I18nManager.allowRTL(false);

const queryClient = new QueryClient();

Geocoder.init('AIzaSyAQdSJ757bWixdQLltgkgVNhqTWMfiSP1o', { language: 'en', interpolation: {
    escapeValue: false 
  } });

// ===== helper: расстояние между двумя точками (Haversine) =====
const distanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // м
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

let App = ({
  workStatus,
  version,
  getAppStatus,
  getVersion,
  user,
  isAuthorized,
  isSplashScreenVisible,
}) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  const [updateModal, setUpdateModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // пуши (и FCM токен кладётся в AsyncStorage.deviceToken)
  usePushNotifications();

  useEffect(() => {
    console.log('[App] user from Redux changed:', user?.id, user?.email);
  }, [user]);

  // =========================
  //   Геолокация: запрос прав (первый запуск, iOS + Android)
  // =========================
  const requestLocationPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const perms = [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ];

        if (Platform.Version >= 29) {
          perms.push(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        }

        const result = await requestMultiple(perms);
        console.log('[Location] Android permissions result:', result);

        const fineGranted =
          result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
            RESULTS.GRANTED ||
          result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
            RESULTS.LIMITED;

        if (fineGranted) {
          setHasLocationPermission(true);
        }
      } else if (Platform.OS === 'ios') {
        const result = await requestMultiple([
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ]);
        console.log('[Location] iOS permissions result:', result);

        const whenInUseGranted =
          result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
          result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.LIMITED;

        if (whenInUseGranted) {
          setHasLocationPermission(true);
        }
      }
    } catch (e) {
      console.log('[Location] error requesting permissions', e);
    }
  };

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  // SSL pinning и стартовые задачи
  async function runStartupTasks() {
    try {
      const publicKeyHashes = await getKeyHashes();

      if (publicKeyHashes) {
        await initializeSslPinning({
          'golalita.com': {
            includeSubdomains: true,
            publicKeyHashes,
          },
        });
      }
    } catch (err) {
      console.log(err, 'error');
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    runStartupTasks();
  }, []);

  // Первичная инициализация (до isReady)
  useEffect(() => {
    (async () => {
      await initializeGlobalTixToken();
      const isTokenValid = await checkIfTokenIsValid();

      console.log(isTokenValid, 'isTokenValid (pre-ready)');

      if (!isTokenValid) {
        dispatch(setIsAuthorized(false));
      }

      const isLoggedOut = await AsyncStorage.getItem('isUserLoggedOut');

      console.log(isLoggedOut, 'isLoggedOut (pre-ready)');

      if (isLoggedOut === 'true') {
        dispatch(setIsAuthorized(false));
        return;
      }

      if (isLoggedOut === 'false') {
        dispatch(getInitialData());
      }
    })();
  }, [dispatch]);

  // Повторная инициализация после isReady
  useEffect(() => {
    if (!isReady) return;

    (async () => {
      await initializeGlobalTixToken();
      const isTokenValid = await checkIfTokenIsValid();

      console.log(isTokenValid, 'isTokenValid (post-ready)');

      if (!isTokenValid) {
        dispatch(setIsAuthorized(false));
      }

      const isLoggedOut = await AsyncStorage.getItem('isUserLoggedOut');

      console.log(isLoggedOut, 'isLoggedOut (post-ready)');

      if (isLoggedOut === 'true') {
        dispatch(setIsAuthorized(false));
        return;
      }

      if (isLoggedOut === 'false') {
        dispatch(getInitialData());
      }
    })();
  }, [isReady, dispatch]);

  useEffect(() => {
    if (!!user && isReady) {
      dispatch(setIsAuthorized(true));
    }
  }, [!!user, isReady, dispatch]);

  useEffect(() => {
    if (typeof isAuthorized === 'boolean' && isReady) {
      setIsLoading(false);
    }
  }, [isAuthorized, isReady]);

  useEffect(() => {
    if (isReady) {
      resetImageCacheDate();
      getVersion();
    }
  }, [isReady, getVersion]);

  useEffect(() => {
    if (isReady) {
      getAppStatus();
      (async () => {
        const lang = await AsyncStorage.getItem('lang');
        i18n.changeLanguage(lang ?? 'en');
      })();
    }
  }, [isReady, getAppStatus, i18n]);

  // Проверка версии
  useEffect(() => {
    if (version && isReady) {
      let latestVersion = version;
      let lastLatestVersionNumber =
        latestVersion.split('.')[latestVersion.split('.').length - 1];
      let secondLatestVersionNumber =
        latestVersion.split('.')[latestVersion.split('.').length - 2];
      let lastCurrentVersionNumber =
        VERSION.split('.')[VERSION.split('.').length - 1];
      let secondCurrentVersionNumber =
        VERSION.split('.')[VERSION.split('.').length - 2];
      let latestVersionNumber = latestVersion.split('.').join('');
      let currentVersionNumber = VERSION.split('.').join('');

      if (latestVersionNumber > currentVersionNumber) {
        if (
          lastLatestVersionNumber !== lastCurrentVersionNumber &&
          latestVersionNumber - currentVersionNumber < 5
        ) {
          setUpdateModal('easy');
        } else if (secondLatestVersionNumber !== secondCurrentVersionNumber) {
          setUpdateModal('hard');
        }
      }
      console.log('latestVersion', latestVersion, VERSION === latestVersion);
    }
  }, [version, isReady]);

  // Выключение приложения при APP_DISABLED
  useEffect(() => {
    if (workStatus === APP_DISABLED && isReady) {
      BackHandler.exitApp();
    }
  }, [workStatus, isReady]);

  // ==============================
  //   userId + fcmToken → native (Android + iOS)
  // ==============================
  useEffect(() => {
  if (!user || !isReady) {
    console.log(
      '[Geofence] skip native auth: user=',
      !!user,
      'isReady=',
      isReady,
      'platform=',
      Platform.OS,
    );
    return;
  }

  const syncAuthToNative = async () => {
    if(Platform.OS === 'android'){
    try {
      let fcmToken = await AsyncStorage.getItem('deviceToken');

      if (!fcmToken) {
        console.log(
          '[Geofence] no FCM token, calling setGeofenceAuthData with empty token',
        );
        fcmToken = '';
      }

      const userId =
        user?.partner_id ??
        user?.id ??
        user?.userId ??
        user?.user_id ??
        user?.uid ??
        null;

      if (!userId) {
        console.log('[Geofence] no userId for native auth, skip');
        return;
      }

      console.log(
        '[Geofence] setGeofenceAuthData userId=',
        userId,
        'token starts with=',
        fcmToken.slice(0, 10),
        'hasLocationPermission=',
        hasLocationPermission,
      );

      await setGeofenceAuthData(Number(userId), fcmToken);

      // 👇 ДОБАВЬ ТУТ ВЫЗОВ ТЕСТА
      await testNativeGeofence();
      // 👆

    } catch (e) {
      console.log('[Geofence] error in setGeofenceAuthData', e);
    }
   }
  };

  syncAuthToNative();
}, [user, isReady, hasLocationPermission]);


  if (STORES_CONFIG.find(item => item.name === user?.organisation)) {
    return <RedirectToStoresModal organization={user.organisation} />;
  }

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
    </>
  );
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  workStatus: state.authReducer.workStatus,
  version: state.authReducer.version,
  isAuthorized: state.authReducer.isAuthorized,
  isSplashScreenVisible: state.authReducer.isSplashScreenVisible,
});

App = connect(mapStateToProps, { getAppStatus, getVersion })(App);

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PortalProvider>
            <App />
          </PortalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default AppWrapper;
