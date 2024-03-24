import express from 'express';
import {
  createNotification,
  deleteNotificationForRecipient,
  getNotification,
  getNotifications,
} from '../controllers/notification-controller.js';

const router = express.Router();

router.post('/', createNotification);

router.delete('/:notificationId', deleteNotificationForRecipient);
router.get('/:notificationId', getNotification);

router.get('/user/:userId', getNotifications);

export default router;
