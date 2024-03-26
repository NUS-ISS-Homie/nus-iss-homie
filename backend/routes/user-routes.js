import express from 'express';
import {
  changePassword,
  changeUsername,
  createUser,
  deleteUser,
  signIn,
  getUserId,
} from '../controllers/user-controller.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));
router.get('/:username', getUserId);

router.post('/signup', createUser);
router.post('/login', signIn);
router.put('/change-password', changePassword);
router.put('/change-username', changeUsername);
router.delete('/delete-user', deleteUser);

export default router;
