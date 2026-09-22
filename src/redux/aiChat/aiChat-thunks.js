import { showMessage } from "react-native-flash-message";
import i18next from "i18next";
import aiChatApi, { getAiChatToken, clearAiChatToken } from "../../api/aiChat";
import { getAuthToken } from "../../utils/tokenStorage";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "../../helpers";
import {
  addAiChatMessage,
  setAiChatHistoryLoading,
  setAiChatMessages,
  setAiChatSending,
} from "./aiChat-actions";

const toFiniteNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const coordsFrom = (source) => {
  const latitude = toFiniteNumber(
    source?.latitude ?? source?.coords?.latitude
  );
  const longitude = toFiniteNumber(
    source?.longitude ?? source?.coords?.longitude
  );

  if (latitude == null || longitude == null) {
    return null;
  }

  return { latitude, longitude };
};

// Prefer live GPS; fall back to cached redux coords. Chat still sends if
// location is unavailable (params simply omit latitude/longitude).
const resolveAiChatLocation = async (getState) => {
  try {
    const status = await requestLocationPermission();

    if (status === "granted") {
      const position = await getCurrentLocation();
      const live = coordsFrom(position?.coords ?? position);
      if (live) {
        return live;
      }
    }
  } catch (e) {
    console.log(e, "resolveAiChatLocation GPS error");
  }

  return coordsFrom(getState().globalReducer.userLocation);
};

const normalizeHistoryMessage = (raw) => ({
  id: raw.id,
  role: raw.role,
  text: raw.message ?? "",
  intent: raw.intent ?? null,
  createdAt: raw.createdAt ?? new Date().toISOString(),
});

const buildLocalMessage = ({ role, text, intent = null }) => ({
  id: `local-${Date.now()}-${Math.random()}`,
  role,
  text,
  intent,
  createdAt: new Date().toISOString(),
});

const resolveMobileToken = async (getState) => {
  const fromStore = getState().authReducer.token;
  if (fromStore) return fromStore;
  return getAuthToken();
};

const describeAiChatError = async (e) => {
  const status = e.response?.status;

  if (status === 401) {
    await clearAiChatToken();
  }
  if (status === 429) {
    return i18next.t("AiChat.rateLimited");
  }
  return e.response?.data?.error?.message || i18next.t("General.error");
};

// One retry after 401: clears a stale AI JWT (e.g. from apex→www redirect
// stripping Authorization) then re-exchanges the mobile session token.
const withAiChatAuthRetry = async (getState, request) => {
  const mobileToken = await resolveMobileToken(getState);
  try {
    const aiToken = await getAiChatToken(mobileToken);
    return await request(aiToken);
  } catch (e) {
    if (e.response?.status !== 401) throw e;
    await clearAiChatToken();
    const freshToken = await getAiChatToken(mobileToken);
    return request(freshToken);
  }
};

export const getAiChatHistory =
  (limit = 50) =>
  async (dispatch, getState) => {
    try {
      dispatch(setAiChatHistoryLoading(true));
      const res = await withAiChatAuthRetry(getState, (aiToken) =>
        aiChatApi.getHistory(aiToken, limit)
      );
      const list = res.data?.data ?? [];

      dispatch(
        setAiChatMessages(
          Array.isArray(list) ? list.map(normalizeHistoryMessage) : []
        )
      );
    } catch (e) {
      await describeAiChatError(e);
      console.log(e, "getAiChatHistory error");
    } finally {
      dispatch(setAiChatHistoryLoading(false));
    }
  };

export const sendAiChatMessage = (message) => async (dispatch, getState) => {
  const trimmed = (message || "").trim();
  if (!trimmed) return;

  dispatch(addAiChatMessage(buildLocalMessage({ role: "user", text: trimmed })));

  try {
    dispatch(setAiChatSending(true));
    const location = await resolveAiChatLocation(getState);
    const res = await withAiChatAuthRetry(getState, (aiToken) =>
      aiChatApi.sendMessage(trimmed, aiToken, location)
    );
    const { reply, intent } = res.data?.data ?? {};

    if (reply) {
      dispatch(
        addAiChatMessage(
          buildLocalMessage({ role: "assistant", text: reply, intent })
        )
      );
    }
  } catch (e) {
    console.log(e, "sendAiChatMessage error");
    showMessage({ message: await describeAiChatError(e), type: "danger" });
  } finally {
    dispatch(setAiChatSending(false));
  }
};

export const clearAiChatHistory = () => async (dispatch, getState) => {
  try {
    await withAiChatAuthRetry(getState, (aiToken) =>
      aiChatApi.clearHistory(aiToken)
    );
    dispatch(setAiChatMessages([]));
  } catch (e) {
    console.log(e, "clearAiChatHistory error");
    showMessage({ message: await describeAiChatError(e), type: "danger" });
  }
};
