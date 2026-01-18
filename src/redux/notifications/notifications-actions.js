import {
  SET_CLICKED_NOTIFICATION_DATA,
  SET_IS_NOTIFICATION_MODAL,
  SET_MESSAGE_NOTIFICATIONS,
  SET_MESSAGE_NOTIFICATIONS_LOADING,
  SET_NOTIFICATIONS,
} from "./notifications-types";

export const setNotifications = (notifications) => ({
  type: SET_NOTIFICATIONS,
  notifications,
});
export const setMessageNotifications = (messageNotifications) => ({
  type: SET_MESSAGE_NOTIFICATIONS,
  messageNotifications,
});
export const setMessageNotificationsLoading = (loading) => ({
  type: SET_MESSAGE_NOTIFICATIONS_LOADING,
  loading,
});
export const setIsNotificationModal = (isNotificationModal) => ({
  type: SET_IS_NOTIFICATION_MODAL,
  isNotificationModal,
});
export const setClickedNotificationData = (clickedNotification) => ({
  type: SET_CLICKED_NOTIFICATION_DATA,
  clickedNotification,
});
