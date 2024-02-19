import express from 'express'
import { createHome, deleteHome, getHome, joinHome, leaveHome } from '../controllers/home-controller.js';

const router = express.Router();

// Controller will contain all user-defined routes
router.get('/', (_, res) => res.send('Hello World from user-service-home'));

router.post('/create', createHome);
router.get('/home', getHome);
router.put('/join', joinHome);
router.put('/leave', leaveHome);
router.delete('/delete', deleteHome);

export default router;