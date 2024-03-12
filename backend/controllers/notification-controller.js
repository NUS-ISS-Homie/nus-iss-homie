import {
  ormCreateNotification as _createNotification,
  ormGetNotification as _getNotification,
  ormGetNotificationsByRecipient as _getNotificationsByRecipient,
  ormDeleteNotificationForRecipient as _deleteNotificationForRecipient,
} from '../models/notification/notification-orm.js';
import * as msg from '../common/messages.js';

export const entity = 'notification';

export async function createNotification(req, res) {
  try {
    const { sender, recipients, message } = req.body;

    if (!sender || !recipients || !message) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const notification = await _createNotification(req.body);
    if (!notification || notification.error) {
      console.log('ERROR!', notification);
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: notification.error.message });
    }

    return res
      .status(msg.STATUS_CODE_CREATED)
      .json({ notification, message: msg.SUCCESS_CREATE(entity) });
  } catch (err) {
    return res
      .status(msg.STATUS_CODE_SERVER_ERROR)
      .json({ message: msg.FAIL_DATABASE_ERROR });
  }
}

export async function getNotification(req, res) {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const resp = await _getNotification(notificationId);

    if (!resp || resp.error) {
      console.log(resp);
      return res
        .status(msg.STATUS_CODE_NOT_FOUND)
        .json({ message: msg.FAIL_NOT_EXIST(entity) });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ notification: resp, message: msg.SUCCESS_READ(entity) });
  } catch (err) {
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function getNotifications(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const resp = await _getNotificationsByRecipient(userId);

    if (!resp || resp.error) {
      console.log(resp);
      return res
        .status(msg.STATUS_CODE_NOT_FOUND)
        .json({ message: msg.FAIL_NOT_EXIST(entity) });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ notification: resp, message: msg.SUCCESS_READ(entity) });
  } catch (err) {
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function deleteNotificationForRecipient(req, res) {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    // Check if notification exists and if user is recipient
    const notification = await _getNotification(notificationId);
    if (!notification || !notification.recipients.includes(userId)) {
      return res
        .status(msg.STATUS_CODE_UNAUTHORIZED)
        .json({ message: msg.FAIL_UNAUTHORIZED });
    }

    const resp = await _deleteNotificationForRecipient(notificationId, userId);
    if (!resp || resp.err) {
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: msg.FAIL_DATABASE_ERROR });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ notification: resp, message: msg.SUCCESS_DELETE(entity) });
  } catch (err) {
    console.log('Error notification: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}
