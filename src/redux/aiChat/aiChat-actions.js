import {
  ADD_AI_CHAT_MESSAGE,
  SET_AI_CHAT_HISTORY_LOADING,
  SET_AI_CHAT_MESSAGES,
  SET_AI_CHAT_SENDING,
} from "./aiChat-types";

export const setAiChatMessages = (messages) => ({
  type: SET_AI_CHAT_MESSAGES,
  messages,
});
export const addAiChatMessage = (message) => ({
  type: ADD_AI_CHAT_MESSAGE,
  message,
});
export const setAiChatHistoryLoading = (loading) => ({
  type: SET_AI_CHAT_HISTORY_LOADING,
  loading,
});
export const setAiChatSending = (sending) => ({
  type: SET_AI_CHAT_SENDING,
  sending,
});
