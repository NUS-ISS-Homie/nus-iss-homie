import { User } from './HomeContext';

export interface Notification {
  _id: string;
  sender: User;
  recipients: User[];
  message: { title: string; content: string };
}

export interface NotificationReq {
  sender: string;
  recipients: string[];
  message: { title: string; content: string };
}

export interface NotificationResponse {
  notification: Notification;
  message: string;
}

export interface NotificationsResponse {
  notification: Notification[];
  message: string;
}
