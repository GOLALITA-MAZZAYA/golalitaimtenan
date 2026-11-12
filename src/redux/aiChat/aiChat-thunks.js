import { showMessage } from "react-native-flash-message";
import i18next from "i18next";
import aiChatApi, { getAiChatToken, clearAiChatToken } from "../../api/aiChat";
import {
  addAiChatMessage,
  setAiChatHistoryLoading,
  setAiChatIntro,
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

// GET /ai/customer-chat/intro returns
//   { app_code, app_id, app_name, app_name_ar, title_en, title_ar,
//     welcome_en, welcome_ar }
// It drives both the chat header (title + app name) and the welcome bubble.

// Picks the `<field>_ar` / `<field>_en` variant for the active app language,
// falling back to the other language if the preferred one is missing. The
// English value may also be the bare `<field>` (app_name has no _en suffix).
export const localizedIntroField = (intro, field) => {
  if (!intro) return undefined;
  const isArabic = (i18next.language || "").startsWith("ar");
  const ar = intro[`${field}_ar`];
  const en = intro[`${field}_en`] || intro[field];
  return (isArabic ? ar || en : en || ar) || undefined;
};

// Resolves to the intro payload, or null when the request fails - the intro
// is decorative and must never block the chat, so this never rejects.
const fetchIntro = async (aiToken) => {
  try {
    const res = await aiChatApi.getIntro(aiToken);
    console.log(res, "getIntro introResintroResintroResintroResintroResintroRes");
    const intro = res.data?.data;
    return intro && typeof intro === "object" ? intro : null;
  } catch (e) {
    console.log(e, "getIntro error");
    return null;
  }
};

const buildIntroMessages = (intro) => {
  const text = localizedIntroField(intro, "welcome");
  if (!text) return [];

  return [
    {
      id: "intro-msg",
      role: "assistant",
      text,
      isIntro: true,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const getAiChatHistory =
  (limit = 50) =>
    async (dispatch, getState) => {
      try {
        dispatch(setAiChatHistoryLoading(true));
        const { token: mobileToken } = getState().authReducer;
        const aiToken = await getAiChatToken(mobileToken);
        // The header needs the intro even when a conversation exists, so it
        // is fetched alongside the history and stored as soon as it lands -
        // independently of whether the history request succeeds.
        const introPromise = fetchIntro(aiToken).then((intro) => {
          if (intro) dispatch(setAiChatIntro(intro));
          return intro;
        });
        const res = await aiChatApi.getHistory(aiToken, limit);
        const list = res.data?.data ?? [];
        const normalized = Array.isArray(list) ? list.map(normalizeHistoryMessage) : [];

        // The welcome message is not part of the stored history, so it is
        // always put back as the first bubble - otherwise it would vanish as
        // soon as the user has a conversation and reopens the screen.
        dispatch(
          setAiChatMessages([
            ...buildIntroMessages(await introPromise),
            ...normalized,
          ])
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

    // Cleared chat goes back to the backend-provided welcome message.
    let { intro } = getState().aiChatReducer;
    if (!intro) {
      intro = await fetchIntro(aiToken);
      if (intro) dispatch(setAiChatIntro(intro));
    }
    dispatch(setAiChatMessages(buildIntroMessages(intro)));
  } catch (e) {
    console.log(e, "clearAiChatHistory error");
    showMessage({ message: await describeAiChatError(e), type: "danger" });
  }
};
