import {
  SET_IS_MERCHANTS_LOADING,
  SET_IS_NOTIFICATIONS_SETTINGS_LOADING,
  SET_IS_OFFERS_LOADING,
} from "./loaders-types";

export const setIsMerchantsLoading = (isMerchantsLoading) => ({
  type: SET_IS_MERCHANTS_LOADING,
  isMerchantsLoading,
});
export const setIsOffersLoading = (isOffersLoading) => ({
  type: SET_IS_OFFERS_LOADING,
  isOffersLoading,
});

export const setIsNotificationsSettingsLoading = (
  isNotificationsSettingsLoading
) => ({
  type: SET_IS_NOTIFICATIONS_SETTINGS_LOADING,
  isNotificationsSettingsLoading,
});
