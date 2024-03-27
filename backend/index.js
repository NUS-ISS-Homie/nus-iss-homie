import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import homeRoutes from './routes/home-routes.js';
import notificationRoutes from './routes/notification-routes.js';
import userRoutes from './routes/user-routes.js';
import expenseRoutes from './routes/expense-routes.js';
import choreRoutes from './routes/chore-routes.js';
import groceryItemRoutes from './routes/grocery-item-routes.js';
import groceryListRoutes from './routes/grocery-list-routes.js';

import {
  sessionStore,
  createEventListeners,
} from './controllers/socket-controller.js';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World from Homie!');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' },
});

io.use((socket, next) => {
  const { sessionId, userId, homeId } = socket.handshake.auth;

  if (sessionId) {
    const session = sessionStore.find(sessionId);

    // Has existing session
    if (session && !userId) {
      socket.sessionId = sessionId;
      socket.userId = session.userId;
      socket.homeId = session.homeId;
      return next();
    }

    // Update session
    if (session && userId) {
      sessionStore.saveSession(sessionId, { userId, homeId });
      socket.sessionId = sessionId;
      socket.userId = userId;
      socket.homeId = homeId;
      return next();
    }
  }

  if (!userId) {
    return next(new Error('Invalid User ID'));
  }

  // Create new session
  socket.sessionId = randomUUID();
  socket.userId = userId;
  socket.homeId = homeId;
  sessionStore.saveSession(sessionId, { userId, homeId });
  next();
});

io.on('connection', (socket) => {
  console.log('SOCKET USER ID: ', socket.userId, '\n');
  console.log('SOCKET HOME ID: ', socket.homeId, '\n');

  socket.join(socket.userId);
  socket.join(socket.homeId);

  socket.emit('session', { sessionId: socket.sessionId });

  createEventListeners(socket, io);
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

httpServer.listen(port, () => {
  console.log(`Homie listening on port ${port}`);
});

export default app;
