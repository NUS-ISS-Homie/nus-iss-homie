import express from 'express';
import {
  createChore,
  getChore,
  updateChore,
  deleteChore,
  getAllChores,
} from '../controllers/chore-controller.js';

const router = express.Router();

// Controller will contain all the Chore-defined Routes
router.get('/', getAllChores);
router.post('/create', createChore);
router.get('/:choreId', getChore);
router.put('/:choreId', updateChore);
router.delete('/:choreId', deleteChore);

export default router;
