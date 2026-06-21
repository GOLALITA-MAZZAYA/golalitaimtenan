import { SET_COUNTRIES, SET_USER_LOCATION, SET_USER_LOCATION_LOADING, SET_MARKETING_POPUP, SET_HAS_SHOWN_MARKETING_POPUP } from "./global-types";

const initialState = {
  coutries: [],

  userLocationLoading: false,
  userLocation: null,
  
  marketingPopup: null,
  hasShownMarketingPopup: false,
};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return { ...state, countries: action.countries };
    case SET_USER_LOCATION_LOADING:
      return { ...state, userLocationLoading: action.loading };
    case SET_USER_LOCATION:
      return { ...state, userLocation: action.location };
    case SET_MARKETING_POPUP:
      return { ...state, marketingPopup: action.popup };
    case SET_HAS_SHOWN_MARKETING_POPUP:
      return { ...state, hasShownMarketingPopup: action.hasShown };
    default:
      return state;
  }
};
