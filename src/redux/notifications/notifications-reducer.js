import {
  SET_IS_NOTIFICATION_MODAL,
  SET_MESSAGE_NOTIFICATIONS,
  SET_NOTIFICATIONS,
  SET_CLICKED_NOTIFICATION_DATA,
  SET_MESSAGE_NOTIFICATIONS_LOADING,
} from "./notifications-types";

const initialState = {
  notifications: [],
  messageNotifications: [],
  messageNotificationsLoading: true,
  isNotificationModal: false,
  clickedNotification: null,
};

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.notifications };
    case SET_MESSAGE_NOTIFICATIONS:
      return { ...state, messageNotifications: action.messageNotifications };
    case SET_MESSAGE_NOTIFICATIONS_LOADING:
      return { ...state, messageNotificationsLoading: action.loading };
    case SET_IS_NOTIFICATION_MODAL:
      return { ...state, isNotificationModal: action.isNotificationModal };
    case SET_CLICKED_NOTIFICATION_DATA:
      return { ...state, clickedNotification: action.clickedNotification };
    default:
      return state;
  }
};
