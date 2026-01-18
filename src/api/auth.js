import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../redux/auth/auth-api";
import { getIsSaveMe } from "./asyncStorage";
import instance from "../redux/instance";

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
    throw new Error();
  }

  return res.data.result;
};

export const checkIfTokenIsValid = async () => {
  try {
    const isSaved = await getIsSaveMe();

    if (isSaved === "false") {
      return false;
    }

    const token = await AsyncStorage.getItem("token");

    if ((isSaved === "true" || isSaved === null) && token) {
      const userData = await authApi.getUserData({
        params: { token },
      });

      if (!userData?.data?.result) {
        return false;
      }

      if (!userData?.data?.result?.error) {
        return true;
      }

      await AsyncStorage.setItem("isUserLoggedOut", "false");
    }

    return false;
  } catch (err) {
    console.log(err, "check is token valid error");
    return false;
  }
};
