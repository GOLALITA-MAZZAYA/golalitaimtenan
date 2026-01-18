import authApi from './auth-api';
import { Platform } from 'react-native';
import axios from 'axios';
import {
  setConfirmationcodeLoading,
  setIsAuthorized,
  setIsLoginError,
  setIsMainUser,
  setIsSplashScreenVisible,
  setIsUserJustLogOut,
  setLoginLoading,
  setProfileLoading,
  setPublicOrganizations,
  setToken,
  setUser,
  setUserId,
  setVersion,
  setWorkStatus,
  setIsloadingAutologin,
} from './auth-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_DISABLED, APP_ENABLED, CONTENT_DISABLED } from './auth-types';
import { showMessage } from 'react-native-flash-message';
import { setPremiumMerchants } from '../merchant/merchant-actions';
import { navigationRef } from '../../Navigation/RootNavigation';
import i18next from 'i18next';
import { setIfEverLoggedIn } from '../../api/asyncStorage';
import { getCountries } from '../global/global-thunks';
import { getAdvert, getParentCategories } from '../merchant/merchant-thunks';
import { getMessageNotifications } from '../notifications/notifications-thunks';
import { verifyEmail, verifyPhone } from '../../api/merchants';

export const getInitialData = () => async (dispatch, getState) => {
  try {
    const { categoriesType } = getState().merchantReducer;
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    // setTimeout(() => {
    //   if (Platform.OS === "android") {
    //     SplashScreen.hide();
    //   } else {
    //     dispatch(setIsSplashScreenVisible(false));
    //   }
    // }, 3000);

    if (userId) dispatch(setUserId(userId));
    if (token) {
      dispatch(getUserData(token));
      dispatch(setToken(token));
      dispatch(getAdvert());
      dispatch(getParentCategories(categoriesType));
      dispatch(getCountries());
      dispatch(getMessageNotifications());
    }
  } catch (err) {
    console.log(err, 'user error');
  }
};

export const login = (body, onSuccess) => async (dispatch, getState) => {
  dispatch(setLoginLoading(true));
  dispatch(setIsLoginError(false));

  const pushToken = await AsyncStorage.getItem('deviceToken');

  const newBody = {
    params: {
      ...body,
      device_id: pushToken,
      expo_token: pushToken,
      device_token: pushToken,
    },
  };

  try {
    const { categoriesType } = getState().merchantReducer;
    const res = await authApi.login(newBody);

    if (res.data.result.error) {
      dispatch(setIsLoginError(true));

      return;
    }

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
    await AsyncStorage.setItem('token', res.data.result.token);
    await AsyncStorage.setItem('isUserLoggedOut', 'false');
    await setIfEverLoggedIn(true.toString());

    dispatch(setToken(res.data.result.token));
    dispatch(setUserId(res.data.result.id));

    dispatch(getUserData(res.data.result.token));
    dispatch(getAdvert());
    dispatch(getParentCategories(categoriesType));
    dispatch(getMessageNotifications());
    dispatch(setIsAuthorized(true));
    onSuccess?.();
  } catch (err) {
    dispatch(setIsLoginError(true));
  } finally {
    dispatch(setLoginLoading(false));
  }
};

export const autologin = token => async (dispatch, getState) => {
  dispatch(setIsloadingAutologin(true));
  dispatch(setIsLoginError(false));

  const { categoriesType } = getState().merchantReducer;
  let res;
  try {
    const url = 'https://www.golalita.com/go/api/user/detail/email';
    const payload = {
      params: {
        token: token,
      },
    };

    console.log('payload auto login', payload);
    res = await axios.post(url, payload);
    if (res.data.result.error) {
      dispatch(setIsLoginError(true));
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
      await AsyncStorage.setItem('token', res.data.result.token);
      await AsyncStorage.setItem('isUserLoggedOut', 'false');

      dispatch(setToken(res.data.result.token));
      dispatch(setUserId(res.data.result.id));

      dispatch(getParentCategories(categoriesType));
      dispatch(getUserData(res.data.result.token));
      dispatch(getAdvert());
      dispatch(setIsAuthorized(true));
      dispatch(setIsloadingAutologin(false));
    }
  } catch (err) {
    console.log(err, 'autologin error');
  }
};

export const logout = () => async dispatch => {
  await AsyncStorage.setItem('token', '');
  await AsyncStorage.setItem('lastLogoutTimestamp', Date.now().toString());
  dispatch(setIsUserJustLogOut(true));
  dispatch(setToken(null));
  dispatch(setUserId(null));
  dispatch(setUser(null));
  dispatch(setIsAuthorized(false));

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

export const getUserBanners = token => async dispatch => {
  const userRes = await authApi.getUserBanners({
    params: {
      token,
    },
  });

  const banners = userRes.data.result.banners;
  const sortedBanners = banners.sort((a, b) =>
    a.x_sequence > b.x_sequence ? 1 : -1,
  );

  dispatch(setPremiumBanners(sortedBanners));
};

export const getUserData = token => async dispatch => {
  const paused_notification = await AsyncStorage.getItem('paused_notification');

  const res = await authApi.getUserData({
    params: { token },
  });

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

    // await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('family_head_id');
  }
};

export const contactUs =
  (body, setIsSuccessContact) => async (dispatch, getState) => {
    const { token, user } = getState().authReducer;
    const res = await authApi.contactUs({
      params: {
        create_vals: JSON.stringify({ ...body, partner_id: user.partner_id }),
        token,
      },
    });
    setIsSuccessContact(true);
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

export const resetPassword =
  (body, setFieldError, t, setIsSuccessSend) => async dispatch => {
    try {
      const res = await authApi.resetPassword(body);

      if (res.data.result.error) {
        setFieldError('login', t('Login.emailNotFound'));
      } else {
        setIsSuccessSend(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

export const getPublicOrganizations = () => async dispatch => {
  try {
    const res = await authApi.getPublicOrganizations();
    dispatch(setPublicOrganizations(res.data.result));
  } catch (e) {
    console.log(e);
  }
};

export const checkCode =
  (body, setFieldError, t, navigation, registerBody, isNeedCode) =>
  async () => {
    try {
      let res;
      if (isNeedCode) {
        res = await authApi.checkCode(body);
      }

      if (
        !isNeedCode ||
        (res &&
          res.data.result.length > 0 &&
          res.data.result[res.data.result.length - 1].org_name ===
            body.params.org_name)
      ) {
        navigation.navigate('CreatePassword', { registerBody });
      } else {
        setFieldError('organizationCode', t('Login.wrongCode'));
      }
    } catch (e) {
      console.log(e);
      setFieldError('organizationCode', t('Login.wrongCode'));
    }
  };

export const register = body => async dispatch => {
  try {
    const res = await authApi.register({ params: body });

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
      alert(i18next.t('Login.somethingWrong'));
    }
  } catch (e) {
    console.log(e);
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
    } finally {
      dispatch(setProfileLoading(false));
    }
  };

export const getVersion = () => async dispatch => {
  try {
    const res = await authApi.getVersion();

    dispatch(setVersion(res.data.result.current_mobile_version));
  } catch (e) {
    console.log(e);
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
  } finally {
    dispatch(setConfirmationcodeLoading(false));
  }
};

export const verifyRegisterCode =
  (body, navigation, setFieldError, t) => async () => {
    const DEFAULT_ORGANIZATION_CODE = '1651';

    try {
      let res;
      res = body.params.code == DEFAULT_ORGANIZATION_CODE;

      if (res) {
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        await AsyncStorage.setItem('randomCode', JSON.stringify(randomCode));
        const payload = {
          params: {
            email: body.params.email,
            validate_code: randomCode,
            method: 'email',
          },
        };
        res = await authApi.validate_code(payload);
        if (res.data.result.status === 'success') {
          navigation.navigate('CodeConfirmation', body);
        }
      } else {
        setFieldError('registration_code', t('Login.wrongCode'));
      }
    } catch (e) {
      console.log(e);
    }
  };
