import { notificationsApi } from "./notifications-api";
import {
  setIsNotificationModal,
  setMessageNotifications,
  setMessageNotificationsLoading,
  setNotifications,
} from "./notifications-actions";

import { CONTENT_DISABLED } from "../auth/auth-types";

import { setIsNotificationsSettingsLoading } from "../loaders/loaders-actions";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setMerchantDetails } from "../merchant/merchant-actions";
import { setUser } from "../auth/auth-actions";

export const getNotifications = () => async (dispatch, getState) => {
  dispatch(setIsNotificationsSettingsLoading(true));
  const { workStatus } = getState().authReducer;
  const { token } = getState().authReducer;
  const res = await notificationsApi.getNotifications({
    params: { token },
  });

  dispatch(
    setNotifications(workStatus === CONTENT_DISABLED ? [] : res.data.result)
  );
  dispatch(setIsNotificationsSettingsLoading(false));
};

export const subscribeNotification =
  (isSubscribe, merchant_id, t) => async (dispatch, getState) => {
    const { merchantDetails } = getState().merchantReducer;

    try {
      let device_id = await AsyncStorage.getItem("deviceToken");
      const { token } = getState().authReducer;
      let res;
      dispatch(
        setMerchantDetails({ ...merchantDetails, is_subscribe: isSubscribe })
      );
      if (isSubscribe) {
        res = await notificationsApi.notificationSubscribe({
          params: {
            token,
            device_id,
            merchant_id,
          },
        });
      } else {
        res = await notificationsApi.notificationUnsubscribe({
          params: { token, merchant_id },
        });
      }

      const result = res.data.result;

      const isSucces =
        result.success.split(" ")[result.success.split(" ").length - 1] ===
        "False";

      if (isSucces && isSubscribe) {
        showMessage({
          message: t("Profile.subscribeSuccess"),
          type: "success",
        });
      }

      if (isSucces && !isSubscribe) {
        showMessage({
          message: t("Profile.unsubscribeSuccess"),
          type: "success",
        });
      }
      dispatch(getNotifications());
      // dispatch(getMerchants(null, null, true))
    } catch (e) {
      showMessage({
        message: t("Profile.subscribeError"),
        type: "success",
      });
      console.log(e);
    }
  };

export const getMessageNotifications = () => async (dispatch, getState) => {
  const token = await AsyncStorage.getItem("token");

  const { isNotificationModal } = getState().notificationsReducer;
  try {
    dispatch(setMessageNotificationsLoading(true));
    console.log("before get notifications");
    const res = await notificationsApi.getMessageNotifications({
      params: { token },
    });
    if (res.data.result.error === undefined) {
      dispatch(setMessageNotifications(res.data.result));
      if (res.data.result.length !== 0 && isNotificationModal === false)
        dispatch(setIsNotificationModal(true));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setMessageNotificationsLoading(false));
  }
};

export const deleteNotification = (body) => async (dispatch, getState) => {
  const { token } = getState().authReducer;

  console.log(body, "body");
  try {
    const res = await notificationsApi.deleteNotification({
      params: {
        ...body,
        token,
      },
    });

    console.log(res, "res");
    dispatch(getMessageNotifications());
  } catch (e) {
    console.log(e);
  }
};

export const readNotification = (notification_id) => async (dispatch) => {
  const { token } = getState().authReducer;

  try {
    await notificationsApi.readNotification({
      params: {
        token,
        notification_id: notification_id,
        read_status: "read",
      },
    });

    dispatch(getMessageNotifications());
  } catch (e) {
    console.log(e, "change notification status error");
  }
};

export const readAllNotifications = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  let { messageNotifications } = getState().notificationsReducer;
  messageNotifications = messageNotifications.filter(
    (m) => m.state === "unread"
  );
  try {
    for (let notification of messageNotifications) {
      const response = await notificationsApi.readNotification({
        params: {
          token,
          notification_id: notification.notification_id,
          read_status: "read",
        },
      });
      console.log("read response.data", response.data);
    }
  } catch (e) {
    console.log(e);
  }
};

export const pauseNotifications =
  (paused_notification) => async (dispatch, getState) => {
    const { token, user } = getState().authReducer;
    const isPaused = await AsyncStorage.getItem("paused_notification");
    try {
      if (!paused_notification) {
        const res = await notificationsApi.pauseAllNotifications({
          params: { token },
        });
        console.log("res.data pause", res.data);
      } else {
        const res = await notificationsApi.unpauseAllNotifications({
          params: { token },
        });
        console.log("res.data unpause", res.data);
      }
      dispatch(setUser({ ...user, paused_notification: !paused_notification }));
      await AsyncStorage.setItem(
        "paused_notification",
        (!user.paused_notification).toString()
      );
    } catch (e) {
      console.log(e);
    }
  };
