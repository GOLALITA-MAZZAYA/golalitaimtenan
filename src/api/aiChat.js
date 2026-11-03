import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

// This service lives on the same /go/api gateway as the rest of the app but,
// unlike it, authenticates with a standard Authorization: Bearer header
// carrying a dedicated AI JWT - not the main app's session token, and not a
// token embedded in the JSON-RPC body. Per Golalita_AI_Chat_Mobile_API_Guide.md,
// that AI JWT is obtained by exchanging the main session token via
// /ai/auth/token, then cached (it's valid 7 days) instead of re-exchanged on
// every call.
const AI_JWT_STORAGE_KEY = "ai_chat_jwt";
const AI_JWT_EXPIRY_KEY = "ai_chat_jwt_expiry";
const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const DEFAULT_EXPIRES_IN_SECONDS = 604800; // 7 days, per the guide

// Server chat timeout is ~25s; the guide recommends a 30-35s client UI
// timeout so a slow-but-successful AI reply isn't cut off by the shared
// instance's default 15s timeout.
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
  const expiryTime = Date.now() + (expiresInSeconds ?? DEFAULT_EXPIRES_IN_SECONDS) * 1000;
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

  // TEMP DEBUG - remove once cross-user AI JWT mixup is diagnosed. Neither
  // value is more sensitive than what's already been in this chat: same
  // shape as tokens already shared for debugging.
  console.log('[AiChatDebug] exchange', {
    mobileToken,
    aiJwtTail: token.slice(-24),
  });

  await storeAiJwt(token, expires_in);
  return token;
};

// Returns a valid AI JWT, exchanging the main app's session token only when
// there's no cached one left with enough life on it. Concurrent callers
// share one in-flight exchange rather than each firing their own request.
export const getAiChatToken = async (mobileToken) => {
  if (cachedAiJwt) {
    console.log('[AiChatDebug] getAiChatToken: in-memory hit', {
      mobileToken,
      aiJwtTail: cachedAiJwt.slice(-24),
    });
    return cachedAiJwt;
  }

  const stored = await getStoredAiJwt();
  if (stored) {
    console.log('[AiChatDebug] getAiChatToken: AsyncStorage hit', {
      mobileToken,
      aiJwtTail: stored.slice(-24),
    });
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

// Drops the cached AI JWT so the next getAiChatToken() call re-exchanges -
// call this after a 401/INVALID_TOKEN response from a chat endpoint, and on
// every login/logout/account-switch (a stale in-flight exchange promise
// from the previous session could otherwise resolve and repopulate the
// cache with the wrong user's JWT right after this clears it).
export const clearAiChatToken = async () => {
  cachedAiJwt = null;
  exchangePromise = null;
  await AsyncStorage.multiRemove([AI_JWT_STORAGE_KEY, AI_JWT_EXPIRY_KEY]);
};

const aiChatApi = {
  sendMessage: (message, token, location) => {
    const params = { message };

    if (
      location?.latitude != null &&
      location?.longitude != null &&
      Number.isFinite(Number(location.latitude)) &&
      Number.isFinite(Number(location.longitude))
    ) {
      params.latitude = Number(location.latitude);
      params.longitude = Number(location.longitude);
    }

    return instance.post(
      "/ai/customer-chat",
      { params },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: CHAT_REQUEST_TIMEOUT_MS,
      }
    );
  },
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
