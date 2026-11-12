import authApi from './auth-api';
import { Platform } from 'react-native';
import instance from '../instance';
import {
  setConfirmationcodeLoading,
  setIsAuthorized,
  setIsLoginError,
  setIsMainUser,
  setIsSplashScreenVisible,
  setIsUserJustLogOut,
  setLoginLoading,
  setProfileLoading,
  setToken,
  setUser,
  setUserId,
  setVersion,
  setWorkStatus,
  setIsloadingAutologin,
  setIsGuest,
} from './auth-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, setToken as storeToken, removeToken as clearStoredToken } from '../../utils/secureStorage';
import { APP_DISABLED, APP_ENABLED, CONTENT_DISABLED } from './auth-types';
import { showMessage } from 'react-native-flash-message';
import { setPremiumMerchants } from '../merchant/merchant-actions';
import { navigationRef } from '../../Navigation/RootNavigation';
import i18next from 'i18next';
import { setIfEverLoggedIn } from '../../api/asyncStorage';
import { assertDeviceSecure } from '../../api/auth';
import { getCountries } from '../global/global-thunks';
import { getAdvert, getParentCategories } from '../merchant/merchant-thunks';
import { getMessageNotifications } from '../notifications/notifications-thunks';
import { verifyEmail, verifyPhone } from '../../api/merchants';
import { org } from '../../org/config';
import { clearAiChatToken } from '../../api/aiChat';
import { setAiChatMessages } from '../aiChat/aiChat-actions';

// The cached AI JWT is exchanged from whichever mobile token was active at
// exchange time - it doesn't carry a user id of its own, so a stale cached
// JWT from a previous session silently serves the WRONG user's chat history
// after a login/logout/account-switch. Call this on every session boundary.
const resetAiChatSession = async dispatch => {
  await clearAiChatToken();
  dispatch(setAiChatMessages([]));
};

// Guest mode is persisted so it survives an app restart (restored in
// getInitialData). It's only written after a successful login.
const IS_GUEST_KEY = 'isGuest';

// prefetchedUserDataRes: an already-fetched /v5/user/dashboard/data response
// for this token (see checkIfTokenIsValid), reused here instead of letting
// getUserData fetch it again.
export const getInitialData = prefetchedUserDataRes => async (dispatch, getState) => {
  try {
    const { categoriesType } = getState().merchantReducer;
    const [token, userId, isGuest] = await Promise.all([
      getToken(),
      AsyncStorage.getItem('userId'),
      AsyncStorage.getItem(IS_GUEST_KEY),
    ]);

    if (userId) dispatch(setUserId(userId));
    if (token) {
      dispatch(setIsGuest(isGuest === 'true'));
      await dispatch(getUserData(token, prefetchedUserDataRes));
      dispatch(setToken(token));
      dispatch(getAdvert());
      dispatch(getParentCategories(categoriesType));
      dispatch(getCountries());
      dispatch(getMessageNotifications());
    } else {
      dispatch(setIsAuthorized(false));
    }
  } catch (err) {
    console.log(err, 'user error');
    // If startup data failed before auth state was resolved, fall back to
    // logged out — otherwise the app never leaves the splash screen. An
    // already-resolved session is left alone.
    if (getState().authReducer.isAuthorized === null) {
      dispatch(setIsAuthorized(false));
    }
  }
};

// asGuest marks the session as the org's shared guest account. It is applied
// only once the login has succeeded, so a failed guest login leaves no flag.
export const login = (body, onSuccess, { asGuest = false } = {}) => async (dispatch, getState) => {
  dispatch(setLoginLoading(true));
  dispatch(setIsLoginError(false));

  try {
    await assertDeviceSecure();
  } catch (error) {
    dispatch(setLoginLoading(false));
    return;
  }

  const pushToken = await AsyncStorage.getItem('deviceToken');

  const newBody = {
    params: {
      ...body,
      device_id: pushToken,
      expo_token: pushToken,
      device_token: pushToken,
    },
  };

  console.log(newBody, 'new body')

  try {
    const { categoriesType } = getState().merchantReducer;
    const res = await authApi.login(newBody);

    console.log(res.data, 'res data')

    if (res.data.result.error) {
      dispatch(setIsLoginError(res.data.result.error));

      return;
    }

    await Promise.all([
      AsyncStorage.multiSet([
        ['userId', res.data.result.id.toString()],
        ['family_head_id', `${res.data.result.family_head_id}`],
        ['tracking_partner_id', `${res.data.result.tracking_partner_id}`],
        ['paused_notification', `${res.data.result.paused_notification}`],
        ['isUserLoggedOut', 'false'],
        [IS_GUEST_KEY, asGuest.toString()],
      ]),
      storeToken(res.data.result.token),
      setIfEverLoggedIn(true.toString()),
    ]);

    dispatch(setToken(res.data.result.token));
    dispatch(setUserId(res.data.result.id));
    dispatch(setIsGuest(asGuest));
    await resetAiChatSession(dispatch);

    dispatch(getUserData(res.data.result.token));
    dispatch(getAdvert());
    dispatch(getParentCategories(categoriesType));
    dispatch(getMessageNotifications());
    dispatch(setIsAuthorized(true));
    onSuccess?.();
  } catch (err) {
    console.log(err, 'login error')
    console.log(err.response?.status, 'login error status')
    console.log(err.response?.data, 'login error response data')
    dispatch(
      setIsLoginError(
        err.response?.data?.result?.error || i18next.t('Login.somethingWrong'),
      ),
    );
  } finally {
    dispatch(setLoginLoading(false));
  }
};

export const autologin = token => async (dispatch, getState) => {
  try {
    await assertDeviceSecure();
  } catch (error) {
    return;
  }

  dispatch(setIsloadingAutologin(true));
  dispatch(setIsLoginError(false));

  const { categoriesType } = getState().merchantReducer;
  let res;
  try {
    const payload = {
      params: {
        token: token,
      },
    };

    console.log('payload auto login', payload);
    res = await instance.post('/user/detail/email', payload);
    if (res.data.result.error) {
      dispatch(setIsLoginError(res.data.result.error));
      dispatch(setIsloadingAutologin('error'));
    } else {
      await AsyncStorage.setItem('userId', res.data.result.id.toString());
      await AsyncStorage.setItem(
        'family_head_id',
        `${res.data.result.family_head_id}`,
      );
      await AsyncStorage.setItem(
        'tracking_partner_id',
        `${res.data.result.tracking_partner_id}`,
      );
      await AsyncStorage.setItem(
        'paused_notification',
        `${res.data.result.paused_notification}`,
      );
      await storeToken(res.data.result.token);
      await AsyncStorage.setItem('isUserLoggedOut', 'false');
      await AsyncStorage.setItem(IS_GUEST_KEY, 'false');

      dispatch(setToken(res.data.result.token));
      dispatch(setUserId(res.data.result.id));
      await resetAiChatSession(dispatch);

      dispatch(getParentCategories(categoriesType));
      dispatch(getUserData(res.data.result.token));
      dispatch(getAdvert());
      dispatch(setIsAuthorized(true));
      dispatch(setIsGuest(false));
      dispatch(setIsloadingAutologin(false));
    }
  } catch (err) {
    console.log(err, 'autologin error');
  }
};

export const logout = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;

  try {
    await authApi.logout({ params: { token } });
  } catch (err) {
    console.log(err, 'logout api error');
  }

  await storeToken('');
  await AsyncStorage.setItem('lastLogoutTimestamp', Date.now().toString());
  dispatch(setIsUserJustLogOut(true));
  dispatch(setToken(null));
  dispatch(setUserId(null));
  dispatch(setUser(null));
  dispatch(setIsAuthorized(false));
  dispatch(setIsGuest(false));
  await AsyncStorage.removeItem(IS_GUEST_KEY);
  await resetAiChatSession(dispatch);

  await AsyncStorage.setItem('isUserLoggedOut', 'true');
};

export const updateProfile = (body, i) => async (dispatch, getState) => {
  const { token, userId, profileLoading } = getState().authReducer;

  try {
    if (!profileLoading) {
      dispatch(setProfileLoading(true));
    }
    const res = await authApi.updateProfile(userId, {
      params: {
        token,
        update_vals: JSON.stringify(body),
      },
    });

    if (res.data.result?.success) {
      if (i == 'isProfile') {
        navigationRef.goBack();
      }

      if (body.email) {
        await dispatch(verifyEmail());
      }

      showMessage({
        message: i18next.t('Profile.profileUpdated'),
        type: 'success',
      });

      dispatch(getUserData(token));
    } else {
      showMessage({
        message: i18next.t('Profile.profileUpdateSuccess'),
        type: 'danger',
      });
    }
  } catch (err) {
    console.log(err, 'update error');
    showMessage({
      message: i18next.t('Profile.profileUpdateError'),
      type: 'danger',
    });
  } finally {
    dispatch(setProfileLoading(false));
  }
};


// prefetchedRes lets a caller that already fetched /v5/user/dashboard/data
// for this token (e.g. checkIfTokenIsValid on app startup) pass that
// response straight through instead of triggering an identical request.
export const getUserData = (token, prefetchedRes) => async dispatch => {
  try {
    const paused_notification = await AsyncStorage.getItem('paused_notification');

    const res = prefetchedRes ?? await authApi.getUserData({
      params: { token },
    });

    console.log('[v5 user/dashboard/data] response:', res.data);

    if (res.data.result.profile) {
      dispatch(
        setUser({
          ...res.data.result.profile,
          x_moi_last_name: res.data.result.x_moi_last_name,
          x_user_expiry: res.data.result.x_user_expiry,
          photo: `${res.data.result.profile.photo}?time=${new Date()}`,
          paused_notification: JSON.parse(paused_notification),
        }),
      );

      dispatch(setPremiumMerchants(res.data.result.premium_merchants));
      dispatch(setToken(token));
      dispatch(setIsMainUser(res.data.result.main_member));
    } else {
      dispatch(setToken(null));
      dispatch(setUserId(null));
      dispatch(setIsAuthorized(false));

      // await clearStoredToken();
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('family_head_id');
    }
  } catch (err) {
    console.log(err, 'getUserData error');
    // Re-throw so getInitialData's own catch (its "fall back to logged out
    // if isAuthorized is still null" safety net) actually runs. Swallowing
    // here silently defeated that safety net — isAuthorized stayed null
    // forever on a network failure, and since App.jsx gates <Root> (the
    // only place that dismisses the splash) on isAuthorized !== null, the
    // app got stuck on the splash screen indefinitely.
    throw err;
  }
};

export const contactUs =
  (body, setIsSuccessContact) => async (dispatch, getState) => {
    try {
      const { token, user } = getState().authReducer;
      const res = await authApi.contactUs({
        params: {
          create_vals: JSON.stringify({ ...body, partner_id: user.partner_id }),
          token,
        },
      });
      setIsSuccessContact(true);
    } catch (err) {
      console.log(err, 'contactUs error');
    }
  };

export const getAppStatus = () => async (dispatch, getState) => {
  try {
    const res = await authApi.getAppStatus();
    if (res.data['enable-app'] === '0') dispatch(setWorkStatus(APP_DISABLED));
    if (res.data['content-display'] === 'Disable')
      dispatch(setWorkStatus(CONTENT_DISABLED));
  } catch (e) {
    dispatch(setWorkStatus(APP_ENABLED));
  }
};



export const register = body => async dispatch => {
  try {
    console.log('[register] request body:', JSON.stringify(body));
    const res = await authApi.register({ params: body });
    console.log('[register] response:', JSON.stringify(res.data));

    if (!res.data?.result?.error) {
      const loginData = {
        device_type: Platform.OS,
        login: body.phone,
        password: body.password,
      };

      const onLoginSuccessCb = async () => {
        try {
          await verifyEmail();
          await verifyPhone();
        } catch (err) {
          console.log(err, 'set verification of email or phone error');
        }
      };

      dispatch(login(loginData, onLoginSuccessCb));
    } else {
      console.log('[register] backend error:', res.data?.result?.error);
      alert(i18next.t('Login.somethingWrong'));
    }
  } catch (e) {
    console.log('[register] request failed:', e?.message, e?.response?.data);
    showMessage({
      message: i18next.t('General.error'),
      type: 'danger',
    });
  }
};

export const sendOTPEmail = (email, setFieldError) => async () => {
  try {
    const res = await authApi.sendOTPEmail({
      params: { email },
    });

    if (typeof res.data.result?.error === 'string') {
      setFieldError('email', res.data.result?.error);
      return;
    }

    if (!res.data.result) {
      setFieldError('email', i18next.t('Login.emailDoesntExist'));
      return;
    } else {
      showMessage({
        message: res.data.result.success,
        type: 'success',
      });
    }

    navigationRef.navigate('Verification', {
      email,
      isForgotPassword: true,
      title: res.data.result.success
    });
  } catch (err) {
    setFieldError('email', i18next.t('Login.somethingWrong'));
  }
};

export const sendOTP =
  (
    body,
    registerBody,
    isResend,
    navigation,
    setFieldError,
    t,
    isForgotPassword,
  ) =>
    async () => {
      try {
        let res;
        if (isForgotPassword) {
          res = await authApi.sendOTP({
            params: body,
          });
        } else {
          res = await authApi.sendOTPRegister({
            params: body,
          });
        }

        if (typeof res.data?.result?.error === 'string') {
          setFieldError('phone', res.data?.result?.error);
          return;
        }

        if (!res?.data?.result) {
          showMessage({
            message: t('Login.somethingWrong'),
            type: 'error',
          });

          return;
        }

        showMessage({
          message: res.data.result.success,
          type: 'success',
        });

        navigation.navigate('Verification', {
          registerBody,
          phone: body.phone,
          isForgotPassword,
        });
      } catch (e) {
        setFieldError('phone', t('Login.somethingWrong'));
      }
    };

export const verify =
  (body, navigation, setFieldError, t, registerBody, isForgotPassword) =>
    async dispatch => {
      try {
        dispatch(setProfileLoading(true));
        let res;
        if (isForgotPassword) {
          res = await authApi.verify(body);
        } else {
          res = await authApi.verifyRegister(body);
        }

        if (res.data?.result?.success) {
          if (isForgotPassword)
            navigation.navigate('CreatePassword', {
              isForgotPassword: true,
              token: res.data.result?.token,
            });
          else {
            dispatch(register(registerBody, navigation, t));
            navigation.navigate('Login');
          }
        } else {
          setFieldError('code', t('Login.wrongCode'));
        }
      } catch (e) {
        console.log(e);
        setFieldError('code', t('General.error'));
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

export const changePassword =
  (body, navigation, setFieldError, t) => async dispatch => {
    try {
      dispatch(setProfileLoading(true));
      const res = await authApi.changePassword({ params: body });

      if (!res.data.result?.error) {
        navigation.navigate('Login');
      } else {
        setFieldError('repeatPassword', t('Login.somethingWrong'));
      }
    } catch (e) {
      console.log(e);
      setFieldError('repeatPassword', t('General.error'));
    } finally {
      dispatch(setProfileLoading(false));
    }
  };

export const getVersion = () => async dispatch => {
  try {
    // 1. Attempt to fetch platform-specific version from the new public endpoint
    const appName = org.versionAppName || org.displayName || 'GoLalita';
    const res = await authApi.getAppVersions(appName);
    const apps = res.data?.result?.apps || [];

    // The backend filters app_name with a partial match, so require an exact
    // name here — an organisation match would also hit the merchant app.
    const targetName = appName.toLowerCase();
    const app = apps.find(a => a.app_name?.toLowerCase() === targetName);

    if (app?.platforms) {
      // Same rule UpdateModal uses to open AppGallery — a Huawei device must be
      // compared against the AppGallery version, never the Play Store one.
      const isHuawei =
        (Platform.constants?.Brand === 'HUAWEI' ||
          Platform.constants?.Manufacturer === 'HUAWEI') &&
        !!org.storeUrls.huawei;

      let platformVersion = null;
      if (isHuawei) {
        platformVersion = app.platforms.huawei?.current_version;
        // Not on AppGallery yet ("Not Uploaded") — nothing to update to.
        if (!/^\d+(\.\d+)+$/.test(String(platformVersion).trim())) return;
      } else if (Platform.OS === 'ios') {
        platformVersion = app.platforms.ios?.current_version;
      } else {
        platformVersion = app.platforms.android?.current_version;
      }

      // Ensure valid semver (e.g. "2.4.1")
      if (platformVersion && /^\d+(\.\d+)+$/.test(String(platformVersion).trim())) {
        dispatch(setVersion(String(platformVersion).trim()));
        return;
      }
    }
  } catch (err) {
    console.log('getAppVersions failed, falling back to legacy getVersion:', err?.message || err);
  }

  // 2. Safe Fallback: legacy endpoint
  try {
    const legacyRes = await authApi.getVersion();
    const legacyVersion = legacyRes.data?.result?.current_mobile_version;
    if (legacyVersion && /^\d+(\.\d+)+$/.test(String(legacyVersion).trim())) {
      dispatch(setVersion(String(legacyVersion).trim()));
    }
  } catch (e) {
    console.log('legacy getVersion error:', e);
  }
};

export const validate_code = body => async dispatch => {
  try {
    dispatch(setConfirmationcodeLoading(true));
    let res;
    res = await authApi.validate_code(body);
    console.log(res);
  } catch (e) {
    console.log('validate_code  error:', e);
    showMessage({
      message: i18next.t('General.error'),
      type: 'danger',
    });
  } finally {
    dispatch(setConfirmationcodeLoading(false));
  }
};

export const verifyRegisterCode =
  // The registration code is already validated by the caller
  // (RegCodeVerification → authApi.checkCode), so this only sends the OTP.
  (body, navigation, setFieldError, t) => async () => {
    try {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      await AsyncStorage.setItem('randomCode', JSON.stringify(randomCode));
      const payload = {
        params: {
          email: body.params.email,
          validate_code: randomCode,
          method: 'email',
        },
      };
      console.log("verifyRegisterCode payload:", payload)
      const res = await authApi.validate_code(payload);
      console.log("verifyRegisterCode res:", res.data)
      if (res.data.result.status === 'success') {
        navigation.navigate('CodeConfirmation', body);
      }
    } catch (e) {
      console.log(e);
      setFieldError('registration_code', t('General.error'));
    }
  };
