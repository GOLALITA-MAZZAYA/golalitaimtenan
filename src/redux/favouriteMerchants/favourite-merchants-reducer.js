import {
  SET_FAVOURITE_MERCHANTS,
  SET_FAVOURITE_MERCHANTS_LOADING,
} from "./favourite-merchants-types";

const initialState = {
  favouriteMerchants: [],
  favouriteMerchantsPage: 1,
  loading: false,
};

export const favouriteMerchantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVOURITE_MERCHANTS:
      return {
        ...state,
        favouriteMerchants: action.merchants,
      };

    case SET_FAVOURITE_MERCHANTS_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};
