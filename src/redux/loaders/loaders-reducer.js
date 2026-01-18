import {
  SET_IS_GIFT_CARDS_LOADING,
  SET_IS_MERCHANTS_LOADING,
  SET_IS_NOTIFICATIONS_SETTINGS_LOADING,
  SET_IS_OFFERS_LOADING,
} from "./loaders-types";

const initialState = {
  isMerchantsLoading: false,
  isOffersLoading: false,
  isNotificationsSettingsLoading: false,
};

export const loadersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_MERCHANTS_LOADING:
      return { ...state, isMerchantsLoading: action.isMerchantsLoading };
    case SET_IS_OFFERS_LOADING:
      return { ...state, isOffersLoading: action.isOffersLoading };
    case SET_IS_GIFT_CARDS_LOADING:
      return { ...state, isGiftCardsLoading: action.isGiftCardsLoading };
    case SET_IS_NOTIFICATIONS_SETTINGS_LOADING:
      return {
        ...state,
        isNotificationsSettingsLoading: action.isNotificationsSettingsLoading,
      };
    default:
      return state;
  }
};
