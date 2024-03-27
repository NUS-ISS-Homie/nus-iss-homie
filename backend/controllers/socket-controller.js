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

  removeSession(sessionId) {
    this.sessions.delete(sessionId);
  }
}

const sessionStore = new SessionStore();

const onDisconnectEvent = (socket) => {
  console.log(`Disconnected with ${socket.id}`);
  sessionStore.saveSession(socket.sessionId, { userId: socket.userId });
};

const onJoinHomeEvent = (io, socket, homeId) => {
  // subscribes to home for notifications
  if (!socket) return;
  socket.join(homeId);
  io.to(homeId).emit('update-home');
};

const onLeaveHomeEvent = (io, socket, homeId) => {
  socket.leave(homeId);
  console.log('LEAVE HOME', homeId);
  io.to(homeId).emit('update-home');
  io.to(socket.id).emit('left-home');
};

const onSendNotificationEvent = (io, homeId) => {
  io.to(homeId).emit('notify');
};

const createEventListeners = (socket, io) => {
  socket.on('delete-session', ({ sessionId }) =>
    sessionStore.removeSession(sessionId)
  );
  socket.on('join-home', (homeId) => onJoinHomeEvent(io, socket, homeId));
  socket.on('accept-join-req', ({ homeId, userId }) =>
    io.to(userId).emit('join-home', homeId)
  );

  socket.on('send-notification', (homeId) =>
    onSendNotificationEvent(io, homeId)
  );
  socket.on('leave-home', (homeId) => onLeaveHomeEvent(io, socket, homeId));

  socket.on('disconnect', () => onDisconnectEvent(socket));
};

export { sessionStore, createEventListeners };
