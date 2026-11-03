import { showMessage } from "react-native-flash-message";
import i18next from "i18next";
import aiChatApi, { getAiChatToken, clearAiChatToken } from "../../api/aiChat";
import {
  addAiChatMessage,
  setAiChatHistoryLoading,
  setAiChatMessages,
  setAiChatSending,
} from "./aiChat-actions";

// TEMP: hardcode Qatar coords until live GPS is wired for AI chat.
const TEMP_AI_CHAT_LOCATION = {
  latitude: 25.286106,
  longitude: 51.534817,
};

// Shapes confirmed against Golalita_AI_Chat_Mobile_API_Guide.md:
// - GET history item:  { id, role, message, intent, createdAt }
// - POST chat reply:    { reply, intent, issue_id } - no id/createdAt/role,
//   since it's not a stored-item lookup, just the fresh AI response.
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

// 401 means the cached AI JWT is missing/expired server-side even though our
// local expiry math said otherwise - drop it so the next call re-exchanges.
// 429 gets a friendlier message than the generic one; everything else shows
// the server's own error.message when present.
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

export const getAiChatHistory =
  (limit = 50) =>
  async (dispatch, getState) => {
    try {
      dispatch(setAiChatHistoryLoading(true));
      const { token: mobileToken } = getState().authReducer;
      const aiToken = await getAiChatToken(mobileToken);
      const res = await aiChatApi.getHistory(aiToken, limit);
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
    const { token: mobileToken } = getState().authReducer;
    const aiToken = await getAiChatToken(mobileToken);
    const res = await aiChatApi.sendMessage(
      trimmed,
      aiToken,
      TEMP_AI_CHAT_LOCATION
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
    const { token: mobileToken } = getState().authReducer;
    const aiToken = await getAiChatToken(mobileToken);
    await aiChatApi.clearHistory(aiToken);
    dispatch(setAiChatMessages([]));
  } catch (e) {
    console.log(e, "clearAiChatHistory error");
    showMessage({ message: await describeAiChatError(e), type: "danger" });
  }
};
