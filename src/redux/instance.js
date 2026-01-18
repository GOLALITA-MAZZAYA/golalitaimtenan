import axios from 'axios';
import store from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setIsAuthorized,
  setIsUserJustLogOut,
  setToken,
  setUser,
  setUserId,
} from './auth/auth-actions';
import { refreshToken } from '../api/auth';

// api base url
export const API_BASE_URL = 'https://www.golalita.com/go/api';

// api base url for gcp test
//export const API_BASE_URL = "https://gcptest.golalita.com/go/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    mode: 'no-cors',
  },
});

const logOutUser = async () => {
  await AsyncStorage.setItem('token', '');
  store.dispatch(setIsUserJustLogOut(true));
  store.dispatch(setToken(null));
  store.dispatch(setUserId(null));
  store.dispatch(setUser(null));
  store.dispatch(setIsAuthorized(false));
};

const onResponseSuccess = async response => {
  const errorMessage =
    response?.data?.error?.message || response?.data?.result?.error;

  if (
    response?.config?.url === '/user/refresh_token' &&
    errorMessage === 'Invalid User Token'
  ) {
    await logOutUser();
    response.data.result = false;
    return response;
  }

  if (errorMessage === 'Invalid User Token') {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      await logOutUser();
      response.data.result = false;
      return response;
    }

    try {
      console.log('calling refresh token');
      console.log(response?.config?.url, 'response?.config?.url');
      console.log(errorMessage, 'errorMessage');
      const res = await refreshToken(token);
      const newToken = res?.token;

      if (res?.error) {
        await logOutUser();
        response.data.result = false;
        return response;
      }

      await AsyncStorage.setItem('token', newToken);

      let newData = response.config.data;

      if (typeof newData === 'string') {
        newData = JSON.parse(newData);
      }

      if (newData.params) {
        newData.params.token = newToken;
      } else {
        newData.token = newToken;
      }

      response.config.data = JSON.stringify(newData);

      return instance(response.config);
    } catch (error) {
      await logOutUser();
      response.data.result = false;
      return response;
    }
  }

  return response;
};

instance.interceptors.response.use(onResponseSuccess);

export default instance;
