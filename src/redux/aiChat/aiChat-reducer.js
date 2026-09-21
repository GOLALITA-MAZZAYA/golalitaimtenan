import {
  ADD_AI_CHAT_MESSAGE,
  SET_AI_CHAT_HISTORY_LOADING,
  SET_AI_CHAT_MESSAGES,
  SET_AI_CHAT_SENDING,
} from "./aiChat-types";

const initialState = {
  messages: [],
  historyLoading: false,
  sending: false,
};

export const aiChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AI_CHAT_MESSAGES:
      return { ...state, messages: action.messages };
    case ADD_AI_CHAT_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };
    case SET_AI_CHAT_HISTORY_LOADING:
      return { ...state, historyLoading: action.loading };
    case SET_AI_CHAT_SENDING:
      return { ...state, sending: action.sending };
    default:
      return state;
  }
};
