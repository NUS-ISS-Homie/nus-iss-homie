import express from 'express';
import {
  changePassword,
  changeUsername,
  createUser,
  deleteUser,
  signIn,
} from '../controllers/user-controller.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));

router.post('/signup', createUser);
router.post('/login', signIn);
router.put('/change-password', changePassword);
router.put('/change-username', changeUsername);
router.delete('/delete-user', deleteUser);

export default router;
