import instance from "../instance";

export const notificationsApi = {
  getNotifications: (body) => instance.post('/user/notification/list', body),
  notificationSubscribe: (body) => instance.post('/user/merchant/subscribe', body),
  notificationUnsubscribe: (body) => instance.post('/user/merchant/unsubscribe', body),
  getMessageNotifications: (body) => instance.post('/user/notification/message/list', body),
  deleteNotification: (body) => instance.post('/user/notification/message/list/delete', body),
  readNotification: (body) => instance.post('/user/notification/list/read/status', body),
  pauseAllNotifications: (body) => instance.post('/pause/notification', body),
  unpauseAllNotifications: (body) => instance.post('/unpause/notification', body)
}
