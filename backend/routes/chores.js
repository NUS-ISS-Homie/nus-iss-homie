import express from 'express';
import choreController from '../controllers/choreController.js';

const choresRoutes = express.Router();

choresRoutes.post('/chores', choreController.createChore);
choresRoutes.get('/chores', choreController.getAllChores);
choresRoutes.get('/chores/:id', choreController.getChoreById);
choresRoutes.put('/chores/:id', choreController.updateChore);
choresRoutes.delete('/chores/:id', choreController.deleteChore);

export default choresRoutes;
