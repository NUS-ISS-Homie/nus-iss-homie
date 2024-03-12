import {
  createNotificationModel,
  getNotificationModel,
  getNotificationModelsByRecipient,
  deleteNotificationForRecipient,
} from './notification-repository.js';

export async function ormCreateNotification(notification) {
  try {
    const newNotification = await createNotificationModel(notification);
    await newNotification.save();
    return newNotification;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetNotification(notificationId) {
  try {
    const notification = await getNotificationModel(notificationId);
    return notification;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetNotificationsByRecipient(username) {
  try {
    const notifications = await getNotificationModelsByRecipient(username);
    return notifications;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormDeleteNotificationForRecipient(
  notificationId,
  recipient
) {
  try {
    await deleteNotificationModelForRecipient(notificationId, recipient);
    return {
      error: false,
      message: 'Notification deletion for recipient successful!',
    };
  } catch (err) {
    return { error: true, message: err };
  }
}
