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
// token is served from memory. At-rest storage stays in the Keychain when
// available, with AsyncStorage as a fallback (e.g. simulator keychain quirks).
let cachedToken = null;
let tokenLoaded = false;
let pendingLoad = null;

const persistTokenFallback = async token => {
  await AsyncStorage.setItem(LEGACY_TOKEN_KEY, token);
  cachedToken = token;
  tokenLoaded = true;
};

const migrateLegacyToken = async () => {
  try {
    const legacyToken = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);

    if (!legacyToken) {
      return null;
    }

    try {
      const stored = await Keychain.setGenericPassword(
        'auth',
        legacyToken,
        keychainOptions,
      );

      if (stored) {
        await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch (error) {
      // Keep the AsyncStorage copy if Keychain is unavailable.
      logger.error(
        'Failed to migrate legacy auth token to Keychain',
        error?.message || error,
      );
    }

    return legacyToken;
  } catch (error) {
    logger.error(
      'Failed to migrate legacy auth token',
      error?.message || error,
    );
    return null;
  }
};

const loadAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword(keychainOptions);

    if (credentials?.password) {
      cachedToken = credentials.password;
      tokenLoaded = true;
      return credentials.password;
    }
  } catch (error) {
    logger.error('Failed to read auth token', error?.message || error);
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
    const stored = await Keychain.setGenericPassword(
      'auth',
      token,
      keychainOptions,
    );

    if (stored) {
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
      cachedToken = token;
      tokenLoaded = true;
      return true;
    }

    logger.error('Failed to store auth token: Keychain returned false');
  } catch (error) {
    logger.error('Failed to store auth token', error?.message || error);
  }

  // Fallback so login still works when Keychain is unavailable (common on
  // iOS Simulator / some Android emulators without a working Keystore).
  try {
    await persistTokenFallback(token);
    return true;
  } catch (fallbackError) {
    logger.error(
      'Failed to save auth token',
      fallbackError?.message || fallbackError,
    );
    return false;
  }
};

export const clearAuthToken = async () => {
  cachedToken = null;
  tokenLoaded = true;

  try {
    await Keychain.resetGenericPassword(keychainOptions);
  } catch (error) {
    logger.error('Failed to clear auth token', error?.message || error);
  }

  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
};
