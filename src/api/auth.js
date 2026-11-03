import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from '../utils/secureStorage';
import authApi from "../redux/auth/auth-api";
import { getIsSaveMe } from "./asyncStorage";
import instance from "../redux/instance";
import {
  isDeviceBlocked,
  showSecurityAlert,
} from '../utils/deviceSecurityCheck';

// The security alert is not a gate by itself (it can be dismissed or fail to
// present), so every path that establishes a session calls this first.
export const assertDeviceSecure = async () => {
  if (await isDeviceBlocked()) {
    showSecurityAlert();
    throw new Error('Login blocked: device failed security checks');
  }
};

export const checkIfUserLoggedOut = async () => {
  const isUserLoggedOut = await AsyncStorage.getItem("isUserLoggedOut");

  if (!isUserLoggedOut || isUserLoggedOut === "false") {
    return false;
  }

  return true;
};

export const refreshToken = async (token) => {
  const res = await instance.post("/user/refresh_token", {
    params: { token },
  });

  if (!res.data.result) {
    // Confirmed by the server: this token is invalid/expired. Tagged so the
    // caller can tell it apart from network/timeout failures on this same
    // request, which must not force a logout.
    const err = new Error('Invalid refresh token');
    err.isInvalidToken = true;
    throw err;
  }

  return res.data.result;
};

// Returns the fetched user-data response on success (falsy `false`
// otherwise) rather than a plain boolean, so the caller can reuse this
// same /v5/user/dashboard/data fetch instead of making an identical request
// again right after (see App.jsx's startup effect + getInitialData).
export const checkIfTokenIsValid = async () => {
  try {
    const isSaved = await getIsSaveMe();

    if (isSaved === "false") {
      return false;
    }

    const token = await getToken();

    console.log(token, 'token')

    if ((isSaved === "true" || isSaved === null) && token) {
      const userData = await authApi.getUserData({
        params: { token },
      });

      if (!userData?.data?.result) {
        return false;
      }

      if (!userData?.data?.result?.error) {
        return userData;
      }

      await AsyncStorage.setItem("isUserLoggedOut", "false");
    }

    return false;
  } catch (err) {
    console.log(err, "check is token valid error");
    // A technical failure here (network error, timeout, etc.) is not proof
    // the session is invalid — return undefined so the caller leaves auth
    // state untouched instead of forcing a logout.
    return undefined;
  }
};
