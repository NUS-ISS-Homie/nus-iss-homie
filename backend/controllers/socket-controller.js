import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  sessionStore,
  createEventListeners,
  registerHomeEvents,
} from '../sockets/home-socket.js';
import { randomUUID } from 'crypto';
import events from '../sockets/events.js';
import 'dotenv/config';

const port = process.env.PORT;

const socket = (app) => {
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

  io.on(events.CONNECTION, (socket) => {
    console.log('SOCKET USER ID: ', socket.userId, '\n');
    console.log('SOCKET HOME ID: ', socket.homeId, '\n');

    socket.join(socket.userId);
    socket.join(socket.homeId);

    socket.emit('session', { sessionId: socket.sessionId });

    createEventListeners(socket, io);
    registerHomeEvents(socket, io);
  });

  httpServer.listen(port, () => {
    console.log(`Homie listening on port ${port}`);
  });
};

export default socket;
