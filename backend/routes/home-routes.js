import express from 'express';
import {
  createHome,
  deleteHome,
  getHome,
  joinHome,
  leaveHome,
} from '../controllers/home-controller.js';

const router = express.Router();

// Controller will contain all user-defined routes
router.get('/', (_, res) => res.send('Hello World from user-service-home'));
router.post('/', createHome);

router.get('/:homeId', getHome);
router.delete('/:homeId', deleteHome);
router.put('/:homeId/join', joinHome);
router.put('/:homeId/leave', leaveHome);

export default router;
