import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

// Same /go/api gateway as the rest of the app, but chat endpoints use a
// dedicated AI JWT via Authorization: Bearer (not the main session token in
// the JSON-RPC body). Exchange once via /ai/auth/token and cache (~7 days).
const AI_JWT_STORAGE_KEY = "ai_chat_jwt";
const AI_JWT_EXPIRY_KEY = "ai_chat_jwt_expiry";
const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const DEFAULT_EXPIRES_IN_SECONDS = 604800; // 7 days

const CHAT_REQUEST_TIMEOUT_MS = 32000;

let cachedAiJwt = null;
let exchangePromise = null;

const getStoredAiJwt = async () => {
  const [token, expiry] = await Promise.all([
    AsyncStorage.getItem(AI_JWT_STORAGE_KEY),
    AsyncStorage.getItem(AI_JWT_EXPIRY_KEY),
  ]);

  if (token && expiry && Date.now() < parseInt(expiry, 10) - REFRESH_BUFFER_MS) {
    return token;
  }
  return null;
};

const storeAiJwt = async (token, expiresInSeconds) => {
  const expiryTime =
    Date.now() + (expiresInSeconds ?? DEFAULT_EXPIRES_IN_SECONDS) * 1000;
  await AsyncStorage.multiSet([
    [AI_JWT_STORAGE_KEY, token],
    [AI_JWT_EXPIRY_KEY, expiryTime.toString()],
  ]);
  cachedAiJwt = token;
};

const exchangeMobileTokenForAiJwt = async (mobileToken) => {
  const res = await instance.post("/ai/auth/token", {
    params: { token: mobileToken },
  });
  const { token, expires_in } = res.data?.data || {};

  if (!token) {
    throw new Error("AI chat: token exchange did not return a token");
  }

  await storeAiJwt(token, expires_in);
  return token;
};

export const getAiChatToken = async (mobileToken) => {
  if (!mobileToken) {
    throw new Error("AI chat: missing mobile session token");
  }

  if (cachedAiJwt) {
    const stillValid = await getStoredAiJwt();
    if (stillValid) {
      return cachedAiJwt;
    }
    cachedAiJwt = null;
  }

  const stored = await getStoredAiJwt();
  if (stored) {
    cachedAiJwt = stored;
    return stored;
  }

  if (!exchangePromise) {
    exchangePromise = exchangeMobileTokenForAiJwt(mobileToken).finally(() => {
      exchangePromise = null;
    });
  }
  return exchangePromise;
};

export const clearAiChatToken = async () => {
  cachedAiJwt = null;
  exchangePromise = null;
  await AsyncStorage.multiRemove([AI_JWT_STORAGE_KEY, AI_JWT_EXPIRY_KEY]);
};

const aiChatApi = {
  sendMessage: (message, token) =>
    instance.post(
      "/ai/customer-chat",
      { params: { message } },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: CHAT_REQUEST_TIMEOUT_MS,
      }
    ),
  getHistory: (token, limit = 50) =>
    instance.get("/ai/customer-chat/history", {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` },
    }),
  clearHistory: (token) =>
    instance.post(
      "/ai/customer-chat/clear",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};

export default aiChatApi;
