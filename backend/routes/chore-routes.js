import express from 'express';
import {
  createChore,
  getChore,
  getChoresByHomeId,
  getChoresByNotificationId,
  updateChore,
  deleteChore,
} from '../controllers/chore-controller.js';

const router = express.Router();

// Controller will contain all the Chore-defined Routes
router.post('/', createChore);
router.get('/:choreId', getChore);
router.get('/home/:homeId', getChoresByHomeId);
router.get('/notification/:notificationId', getChoresByNotificationId);
router.put('/:choreId', updateChore);
router.delete('/:choreId', deleteChore);

export default router;
