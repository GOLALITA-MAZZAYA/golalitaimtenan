import { SET_LOCATIONS, SET_LOCATIONS_LOADING } from "./locations-types";

export const setLocations = (locations) => ({ type: SET_LOCATIONS, locations });

export const setLocationsLoading = (loading) => ({
  type: SET_LOCATIONS_LOADING,
  loading,
});
