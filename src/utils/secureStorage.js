import { NativeModules } from 'react-native';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE = 'golalita_auth_token';
const ASYNC_TOKEN_KEY = 'token';

// Keychain reads go through the OS keystore and are slow, and dozens of API
// call sites need the token on every request — so after the first read the
// token is served from memory. At-rest storage prefers Keychain when the
// native module is linked; otherwise falls back to AsyncStorage (Android
// release builds have hit a null RNKeychainManager after minify).
let cachedToken = null;
let tokenLoaded = false;
let pendingLoad = null;

const isKeychainAvailable = () =>
  NativeModules?.RNKeychainManager != null;

// One-time migration: existing sessions had their token in AsyncStorage.
// Move it into Keychain on first read so users aren't forced to re-login.
const migrateFromAsyncStorage = async () => {
  const legacyToken = await AsyncStorage.getItem(ASYNC_TOKEN_KEY);
  if (!legacyToken) return null;

  if (isKeychainAvailable()) {
    try {
      await Keychain.setGenericPassword('token', legacyToken, {
        service: SERVICE,
      });
      await AsyncStorage.removeItem(ASYNC_TOKEN_KEY);
    } catch {
      // Keep the AsyncStorage copy if Keychain write fails.
    }
  }

  return legacyToken;
};

const loadToken = async () => {
  try {
    if (isKeychainAvailable()) {
      const credentials = await Keychain.getGenericPassword({
        service: SERVICE,
      });
      if (credentials) return credentials.password;
    }

    return await migrateFromAsyncStorage();
  } catch (err) {
    try {
      return await AsyncStorage.getItem(ASYNC_TOKEN_KEY);
    } catch {
      return null;
    }
  }
};

export const getToken = async () => {
  if (tokenLoaded) {
    return cachedToken;
  }

  if (!pendingLoad) {
    pendingLoad = loadToken()
      .then(token => {
        // Don't cache a failed/empty read — the next call should retry.
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

export const setToken = async token => {
  if (!token) {
    return removeToken();
  }

  if (isKeychainAvailable()) {
    try {
      await Keychain.setGenericPassword('token', token, { service: SERVICE });
      cachedToken = token;
      tokenLoaded = true;
      await AsyncStorage.removeItem(ASYNC_TOKEN_KEY).catch(() => {});
      return;
    } catch (err) {
      console.log(err, 'Keychain setToken failed, falling back to AsyncStorage');
    }
  }

  await AsyncStorage.setItem(ASYNC_TOKEN_KEY, token);
  cachedToken = token;
  tokenLoaded = true;
};

export const removeToken = async () => {
  cachedToken = null;
  tokenLoaded = true;

  if (isKeychainAvailable()) {
    try {
      await Keychain.resetGenericPassword({ service: SERVICE });
    } catch {
      // Ignore — still clear AsyncStorage below.
    }
  }

  await AsyncStorage.removeItem(ASYNC_TOKEN_KEY);
};
