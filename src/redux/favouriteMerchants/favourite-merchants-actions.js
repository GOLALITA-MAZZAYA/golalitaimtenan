import {
  SET_FAVOURITE_MERCHANTS,
  SET_FAVOURITE_MERCHANTS_LOADING,
} from "./favourite-merchants-types";

export const setFavouriteMerchants = (merchants) => ({
  type: SET_FAVOURITE_MERCHANTS,
  merchants,
});

export const setFavouriteMerchantsLoading = (loading) => ({
  type: SET_FAVOURITE_MERCHANTS_LOADING,
  loading,
});
