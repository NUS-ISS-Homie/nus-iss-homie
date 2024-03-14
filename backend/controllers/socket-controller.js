class SessionStore {
  sessions = new Map();

  constructor() {
    this.sessions = new Map();
  }

  find(sessionId) {
    return this.sessions.get(sessionId);
  }

  saveSession(sessionId, session) {
    this.sessions.set(sessionId, session);
  }
}

const sessionStore = new SessionStore();

const onDisconnectEvent = (socket) => {
  console.log(`Disconnected with ${socket.id}`);
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    socketId: socket.socketId,
  });
};

const onJoinHomeEvent = (io, socket, homeId) => {
  // subscribes to home for notifications
  if (!socket) return;
  console.log('AUTH:', socket.handshake.auth);
  socket.join(homeId);
  io.to(socket.id).emit('joined-home');
  socket.on('send-notification', (notification) =>
    onSendNotificationEvent(io, notification)
  );
  socket.on('leave-home', () => onLeaveHomeEvent(io, socket, homeId));
};

const onLeaveHomeEvent = (io, socket, homeId) => {
  socket.leave(homeId);
  io.to(socket.id).emit('left-home');
};

const onSendNotificationEvent = (io, homeId) => {
  io.to(homeId).emit('notify');
};

const createEventListeners = (socket, io) => {
  socket.on('join-home', (homeId) => onJoinHomeEvent(io, socket, homeId));
  socket.on('accept-join-req', ({ homeId, userId }) =>
    io.to(userId).emit('join-home', homeId)
  );
  socket.on('disconnect', () => onDisconnectEvent(socket));
  socket.on('send-notification', (homeId) =>
    onSendNotificationEvent(io, homeId)
  );
};

export { sessionStore, createEventListeners };
