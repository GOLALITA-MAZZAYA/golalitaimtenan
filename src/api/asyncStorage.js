import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

const ASYNC_STORAGE_CONSTANTS = {
  IF_EVER_LOGGED_IN: "IF_EVER_LOGGED_IN",
  IS_SAVE_ME: "IS_SAVE_ME",
};

export const isImageCacheDateExpired = async () => {
  const date = await AsyncStorage.getItem("lastImageCacheResetDate");

  if (!date) {
    const newExpirationDate = String(new Date().getTime());
    await AsyncStorage.setItem("lastImageCacheResetDate", newExpirationDate);

    return false;
  }

  const oneDay = 24 * 60 * 60 * 1000;

  if (new Date().getTime() - +date > oneDay * 6) {
    return true;
  }

  if (new Date().getDay() === 5) {
    return true;
  }

  return false;
};

export const resetImageCacheDate = async () => {
  try {
    const isExpired = await isImageCacheDateExpired();

    if (isExpired) {
      await FastImage.clearMemoryCache();
      await FastImage.clearDiskCache();
      const newExpirationDate = String(new Date().getTime());
      await AsyncStorage.setItem("lastImageCacheResetDate", newExpirationDate);
    }

    console.log("successfully cleared image cache");
  } catch (err) {
    console.log(err, "err");
    console.log("reset date error");
  }
};

export const getIfEverLoggedIn = async () => {
  const value = await AsyncStorage.getItem(
    ASYNC_STORAGE_CONSTANTS.IF_EVER_LOGGED_IN
  );

  return value;
};

export const setIfEverLoggedIn = async (value) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_CONSTANTS.IF_EVER_LOGGED_IN, value);
};

export const getIsSaveMe = async () => {
  const value = await AsyncStorage.getItem(ASYNC_STORAGE_CONSTANTS.IS_SAVE_ME);

  return value;
};

export const setIsSaveMe = async (value) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_CONSTANTS.IS_SAVE_ME, value);
};
