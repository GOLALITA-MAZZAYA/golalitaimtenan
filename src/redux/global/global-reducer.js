import { SET_COUNTRIES, SET_USER_LOCATION, SET_USER_LOCATION_LOADING } from "./global-types";

const initialState = {
  coutries: [],

  userLocationLoading: false,
  userLocation: null,

};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return { ...state, countries: action.countries };
    case SET_USER_LOCATION_LOADING:
      return { ...state, userLocationLoading: action.loading };
    case SET_USER_LOCATION:
      return { ...state, userLocation: action.location };
    default:
      return state;
  }
};
