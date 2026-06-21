import { SET_COUNTRIES, SET_USER_LOCATION, SET_USER_LOCATION_LOADING, SET_MARKETING_POPUP, SET_HAS_SHOWN_MARKETING_POPUP } from "./global-types";

export const setMarketingPopup = (popup) => ({
  type: SET_MARKETING_POPUP,
  popup,
});

export const setHasShownMarketingPopup = (hasShown) => ({
  type: SET_HAS_SHOWN_MARKETING_POPUP,
  hasShown,
});

export const setCountries = (countries) => ({
  type: SET_COUNTRIES,
  countries,
});

export const setUserLocation = (location) => ({
  type: SET_USER_LOCATION,
  location,
});

export const setUserLocationLoading = (loading) => ({
  type: SET_USER_LOCATION_LOADING,
  loading,
});
