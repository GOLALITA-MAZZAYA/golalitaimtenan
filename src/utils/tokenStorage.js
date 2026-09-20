import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import logger from './logger';

const AUTH_TOKEN_SERVICE = 'com.golalitaimtenanrewards.authToken';
const LEGACY_TOKEN_KEY = 'token';

const keychainOptions = {
  service: AUTH_TOKEN_SERVICE,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

// Keychain reads go through the Android Keystore and are slow, and the axios
// interceptor needs the token on every request — so after the first read the
// token is served from memory. At-rest storage stays in the Keychain.
let cachedToken = null;
let tokenLoaded = false;
let pendingLoad = null;

const migrateLegacyToken = async () => {
  try {
    const legacyToken = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);

    if (!legacyToken) {
      return null;
    }

    await Keychain.setGenericPassword('auth', legacyToken, keychainOptions);
    await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
    return legacyToken;
  } catch (error) {
    logger.error('Failed to migrate legacy auth token');
    return null;
  }
};

const loadAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword(keychainOptions);

    if (credentials?.password) {
      return credentials.password;
    }
  } catch (error) {
    logger.error('Failed to read auth token');
    return migrateLegacyToken();
  }

  const migratedToken = await migrateLegacyToken();
  cachedToken = migratedToken;
  tokenLoaded = true;
  return migratedToken;
};

export const getAuthToken = async () => {
  if (tokenLoaded) {
    return cachedToken;
  }

  if (!pendingLoad) {
    pendingLoad = loadAuthToken()
      .then(token => {
        if (token) {
          cachedToken = token;
          tokenLoaded = true;
        }
        return token;
      })
      .finally(() => {
        pendingLoad = null;
      });
  }

  return pendingLoad;
};

export const setAuthToken = async token => {
  if (!token) {
    return clearAuthToken();
  }

  try {
    await Keychain.setGenericPassword('auth', token, keychainOptions);
    await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
    cachedToken = token;
    tokenLoaded = true;
    return true;
  } catch (error) {
    logger.error('Failed to store auth token');
    return false;
  }
};

export const clearAuthToken = async () => {
  cachedToken = null;
  tokenLoaded = true;

  try {
    await Keychain.resetGenericPassword(keychainOptions);
  } catch (error) {
    logger.error('Failed to clear auth token');
  }

  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
};
