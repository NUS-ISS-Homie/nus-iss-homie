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
    console.log('SESSION REMOVED!');
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
  io.to(homeId).emit('joined-home');
  socket.on('leave-home', () => onLeaveHomeEvent(io, socket, homeId));
};

const onLeaveHomeEvent = (io, socket, homeId) => {
  socket.leave(homeId);
  io.to(socket.id).emit('left-home');
};

const onSendNotificationEvent = (io, homeId) => {
  io.to(homeId).emit('notify');
};

const onUpdateExpensesEvent = (io, homeId) => {
  io.to(homeId).emit('update-expenses');
};

const createEventListeners = (socket, io) => {
  socket.on('delete-session', ({ sessionId }) =>
    sessionStore.removeSession(sessionId)
  );
  socket.on('join-home', (homeId) => onJoinHomeEvent(io, socket, homeId));
  socket.on('accept-join-req', ({ homeId, userId }) =>
    io.to(userId).emit('join-home', homeId)
  );
  socket.on('disconnect', () => onDisconnectEvent(socket));
  socket.on('send-notification', (homeId) =>
    onSendNotificationEvent(io, homeId)
  );

  socket.on('update-expenses', (homeId) => onUpdateExpensesEvent(io, homeId));
};

export { sessionStore, createEventListeners };
