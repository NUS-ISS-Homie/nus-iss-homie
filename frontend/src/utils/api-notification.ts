import {
  Notification,
  NotificationResponse,
  NotificationsResponse,
} from '../@types/Notification';
import { URL_NOTIF_SVC } from '../configs';
import { API, requests } from './api-request';

const APINotification = {
  createNotification: (
    notification: Notification
  ): Promise<API.Response<NotificationResponse>> => {
    return requests.post(URL_NOTIF_SVC, '', notification);
  },

  getNotification: (
    notificationId: string
  ): Promise<API.Response<NotificationResponse>> => {
    return requests.get(URL_NOTIF_SVC, `/${notificationId}`);
  },

  getNotificationByUserId: (
    userId: string
  ): Promise<API.Response<NotificationsResponse>> => {
    return requests.get(URL_NOTIF_SVC, `/user/${userId}`);
  },

  deleteNotification: (
    notificationId: string,
    userId: string
  ): Promise<API.Response<NotificationResponse>> => {
    return requests.delete(URL_NOTIF_SVC, `/${notificationId}`, { userId });
  },
};

export default APINotification;
