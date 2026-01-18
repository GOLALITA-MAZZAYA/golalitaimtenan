import {
  SET_IS_AUTHORIZED,
  SET_IS_LOGIN_ERROR,
  SET_IS_MAIN_USER,
  SET_IS_USER_JUST_LOG_OUT,
  SET_LOGIN_LOADING,
  SET_PROFILE_LOADING,
  SET_PUBLIC_ORGANIZATIONS,
  SET_SPLASH_SCREEN_VISIBLE,
  SET_TOKEN,
  SET_USER,
  SET_USER_ID,
  SET_VERSION,
  SET_WORK_STATUS,
  SET_CONFIRMATIONCODE_LOADING,
  SET_REGISTERATIONCODE_LOADING,
  SET_ISLOADING_AUTOLOGIN,
} from "./auth-types";

export const setProfileLoading = (profileLoading) => ({
  type: SET_PROFILE_LOADING,
  profileLoading,
});

export const setRegisterationcodeLoading = (registrationcodeLoading) => ({
  type: SET_REGISTERATIONCODE_LOADING,
  registrationcodeLoading,
});

export const setUser = (user) => ({ type: SET_USER, user });
export const setIsLoginError = (isLoginError) => ({
  type: SET_IS_LOGIN_ERROR,
  isLoginError,
});
export const setLoginLoading = (loading) => ({
  type: SET_LOGIN_LOADING,
  loading,
});
export const setToken = (token) => ({ type: SET_TOKEN, token });
export const setUserId = (userId) => ({ type: SET_USER_ID, userId });
export const setWorkStatus = (workStatus) => ({
  type: SET_WORK_STATUS,
  workStatus,
});
export const setPublicOrganizations = (publicOrganizations) => ({
  type: SET_PUBLIC_ORGANIZATIONS,
  publicOrganizations,
});
export const setVersion = (version) => ({ type: SET_VERSION, version });

export const setIsUserJustLogOut = (payload) => ({
  type: SET_IS_USER_JUST_LOG_OUT,
  payload,
});

export const setIsAuthorized = (payload) => ({
  type: SET_IS_AUTHORIZED,
  payload,
});

export const setIsSplashScreenVisible = (payload) => ({
  type: SET_SPLASH_SCREEN_VISIBLE,
  payload,
});

export const setIsMainUser = (payload) => ({
  type: SET_IS_MAIN_USER,
  payload,
});

export const setConfirmationcodeLoading = (confirmationcodeLoading) => ({
  type: SET_CONFIRMATIONCODE_LOADING,
  confirmationcodeLoading,
});


export const setIsloadingAutologin = (payload) => ({
  type: SET_ISLOADING_AUTOLOGIN,
  payload,
});