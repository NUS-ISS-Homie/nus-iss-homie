import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import homeRoutes from './routes/home-routes.js';
import notificationRoutes from './routes/notification-routes.js';
import userRoutes from './routes/user-routes.js';
import expenseRoutes from './routes/expense-routes.js';
import choreRoutes from './routes/chore-routes.js';
import groceryItemRoutes from './routes/grocery-item-routes.js';
import groceryListRoutes from './routes/grocery-list-routes.js';
import socket from './controllers/socket-controller.js';
import { cronJob } from './cron/sendDailyChoreReminder.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

socket(app);

cronJob.start();

app.get('/', (req, res) => {
  res.send('Hello World from Homie!');
});

app.use('/api/home', homeRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/notification', notificationRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/user', userRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/expense', expenseRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/chore', choreRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/grocery-item', groceryItemRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/grocery-list', groceryListRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

export default app;
