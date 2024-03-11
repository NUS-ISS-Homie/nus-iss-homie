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
router.post('/', createHome);
router.put('/', getHome);
router.delete('/', deleteHome);
router.put('/leave', leaveHome);

router.get('/:homeId', getHome);
router.put('/:homeId/join', joinHome);

export default router;
