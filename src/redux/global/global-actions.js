import { SET_COUNTRIES, SET_USER_LOCATION, SET_USER_LOCATION_LOADING } from "./global-types";

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
