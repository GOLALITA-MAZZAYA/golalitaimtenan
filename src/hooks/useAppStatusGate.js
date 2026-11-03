import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAppStatus } from '../redux/auth/auth-thunks';
import { APP_DISABLED } from '../redux/auth/auth-types';
import { resetImageCacheDate } from '../api/asyncStorage';

// Post-ready startup housekeeping: app-status/content-flag fetch, saved
// language restore, image-cache bookkeeping, and the hard kill switch when
// the backend marks the app disabled.
export const useAppStatusGate = ({ isReady, workStatus }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isReady) return;

    resetImageCacheDate();
    dispatch(getAppStatus());

    (async () => {
      const lang = await AsyncStorage.getItem('lang');
      i18n.changeLanguage(lang ?? 'en');
    })();
  }, [isReady, dispatch, i18n]);

  useEffect(() => {
    if (workStatus === APP_DISABLED && isReady) {
      BackHandler.exitApp();
    }
  }, [workStatus, isReady]);
};
