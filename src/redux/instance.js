// api.js
import axios from 'axios';
import { getToken, setToken as storeToken, removeToken as clearStoredToken } from '../utils/secureStorage';
import store from './store';
import {
  setIsAuthorized,
  setIsUserJustLogOut,
  setToken,
  setUser,
  setUserId,
} from './auth/auth-actions';
import { refreshToken } from '../api/auth';
import { E2E_ENCRYPTION_ENABLED } from '../constants';
import { org } from '../org/config';
import {
  encryptRequest,
  decryptResponse,
  isEncryptedEnvelope,
  E2E_VERSION,
} from '../utils/e2ee';
import { logger } from '../utils/logger';

export const API_BASE_URL = `https://${org.baseUrl}/go/api`;

// No timeout meant a stalled connection (dead network, DNS hang, silently
// dropped packets) left the request pending forever — every caller up the
// chain (checkIfTokenIsValid, getUserData, getInitialData) was awaiting a
// promise that would never settle, so nothing ever hit a catch block and
// the app stuck on the splash screen indefinitely. See audit §3.2b.
const REQUEST_TIMEOUT_MS = 15000;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'ReactNativeApp/1.0',
  },
});

const controllers = new Set();
let requestLock = false;   // lock to prevent overlapping requests
let lastRequest = null;    // store last request for debugging

// Per-endpoint call counts (method + normalized path), so repeated/duplicate
// fetches from a screen are easy to spot without wiring up a real APM.
const apiCallCounts = new Map();

const trackApiCall = config => {
  const key = `${(config.method || 'get').toUpperCase()} ${requestPath(config)}`;
  apiCallCounts.set(key, (apiCallCounts.get(key) || 0) + 1);
};

export const getApiCallStats = () =>
  [...apiCallCounts.entries()].sort((a, b) => b[1] - a[1]);

export const resetApiCallStats = () => apiCallCounts.clear();

export const logApiCallStats = () => {
  logger.info('API CALL COUNTS:', Object.fromEntries(getApiCallStats()));
};

// Only requests to our own backend get the E2E envelope — some calls go
// through this instance with absolute URLs to third-party hosts that
// cannot decrypt it.
const isOwnApiRequest = request => {
  const url = request.url || '';
  return !/^https?:\/\//i.test(url) || url.startsWith(`https://${org.baseUrl}`);
};

const hasEncryptableBody = request =>
  ['post', 'put', 'patch'].includes((request.method || '').toLowerCase());

// Normalized URL path as the server sees it (protocol v1 route binding):
// path component only — no scheme/host, no query string, no trailing slash.
const requestPath = request => {
  const url = request.url || '';
  let path;
  if (/^https?:\/\//i.test(url)) {
    path = url.replace(/^https?:\/\/[^/]*/i, '');
  } else {
    const basePath = (request.baseURL || API_BASE_URL).replace(
      /^https?:\/\/[^/]*/i,
      '',
    );
    path = basePath + (url.startsWith('/') ? url : `/${url}`);
  }
  path = path.split('?')[0].split('#')[0];
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
};

const logOutUser = async () => {
  await clearStoredToken();
  store.dispatch(setIsUserJustLogOut(true));
  store.dispatch(setToken(null));
  store.dispatch(setUserId(null));
  store.dispatch(setUser(null));
  store.dispatch(setIsAuthorized(false));
};

export const cancelAllRequests = () => {
  controllers.forEach(c => c.abort());
  controllers.clear();
};

// Attach AbortController to every request
instance.interceptors.request.use(config => {
  const controller = new AbortController();
  config.signal = controller.signal;
  controllers.add(controller);

  if (__DEV__) {
    lastRequest = config; // store last request for debug
    trackApiCall(config);
  }
  config.metadata = { startTime: Date.now() };

  if (config.data) {
    try {
      logger.debug('REQUEST BODY:', typeof config.data === 'string' ? JSON.parse(config.data) : config.data);
    } catch {
      logger.debug('REQUEST BODY RAW:', config.data);
    }
  }

  if (
    E2E_ENCRYPTION_ENABLED &&
    isOwnApiRequest(config) &&
    hasEncryptableBody(config)
  ) {
    // Fail closed: if encryption throws, reject instead of sending plaintext.
    const { envelope, responseKey } = encryptRequest(config.data, {
      method: config.method,
      path: requestPath(config),
    });
    // Kept so the refresh-token retry below can rebuild+re-encrypt with the
    // new token instead of mutating the (already encrypted) envelope.
    config.e2eOriginalData = config.data;
    config.data = envelope;
    config.e2eResponseKey = responseKey;
    config.headers['X-E2E-Version'] = String(E2E_VERSION);
  }

  return config;
});

// Response interceptor with refresh token logic
instance.interceptors.response.use(
  async response => {
    const startTime = response.config?.metadata?.startTime;
    logger.api(
      (response.config?.method || 'get').toUpperCase(),
      requestPath(response.config || {}),
      response.status,
      startTime ? Date.now() - startTime : '?',
    );

    const responseKey = response.config?.e2eResponseKey;
    if (responseKey && isEncryptedEnvelope(response.data)) {
      response.data = decryptResponse(response.data, responseKey);
    }

    const rawError =
      response?.data?.error?.message || response?.data?.result?.error;
    const errorMessage =
      typeof rawError === 'string' ? rawError : rawError?.message;

    if (
      response?.config?.url === '/user/refresh_token' &&
      errorMessage === 'Invalid User Token'
    ) {
      await logOutUser();
      response.data.result = false;
      return response;
    }

    if (errorMessage === 'Invalid User Token') {
      const token = await getToken();
      if (!token) {
        await logOutUser();
        response.data.result = false;
        return response;
      }

      try {
        const res = await refreshToken(token);
        const newToken = res?.token;

        if (res?.error || !newToken) {
          if (res?.error) {
            await logOutUser();
          }
          response.data.result = false;
          return response;
        }

        await storeToken(newToken);

        const wasEncrypted = !!response.config.e2eResponseKey;
        let newData = wasEncrypted
          ? response.config.e2eOriginalData
          : response.config.data;
        if (typeof newData === 'string') newData = JSON.parse(newData);

        if (newData.params) {
          newData.params.token = newToken;
        } else {
          newData.token = newToken;
        }

        if (wasEncrypted) {
          // Re-encrypt from scratch rather than mutating the old envelope —
          // a fresh session key per request is the point of the protocol.
          const { envelope, responseKey } = encryptRequest(newData, {
            method: response.config.method,
            path: requestPath(response.config),
          });
          response.config.e2eOriginalData = newData;
          response.config.data = envelope;
          response.config.e2eResponseKey = responseKey;
        } else {
          response.config.data = JSON.stringify(newData);
        }

        return instance(response.config);
      } catch (err) {
        // Only a server-confirmed invalid/expired token should log the user
        // out. A network timeout, dropped connection, or any other error
        // while attempting the refresh must not — it just fails this request.
        if (err?.isInvalidToken) {
          await logOutUser();
        } else {
          logger.debug('Token refresh failed (non-auth error), not logging out:', err?.message);
        }
        response.data.result = false;
        return response;
      }
    }

    return response;
  },
  error => {
    const startTime = error.config?.metadata?.startTime;
    logger.api(
      (error.config?.method || 'get').toUpperCase(),
      requestPath(error.config || {}),
      error.response?.status ?? 'ERR',
      startTime ? Date.now() - startTime : '?',
    );

    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      logger.debug('Request cancelled:', error.config?.url);
    }

    const responseKey = error.config?.e2eResponseKey;
    if (responseKey && isEncryptedEnvelope(error.response?.data)) {
      try {
        error.response.data = decryptResponse(error.response.data, responseKey);
      } catch (e) {
        // leave the encrypted body in place if the error payload is corrupt
      }
    }

    return Promise.reject(error);
  }
);

export { lastRequest }; // for debugging the last request
export default instance;