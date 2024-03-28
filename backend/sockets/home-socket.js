import events from './events.js';

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
  console.log(`Disconnected with ${socket.userId}`);
  sessionStore.saveSession(socket.sessionId, { userId: socket.userId });
};

const onJoinHomeEvent = (io, socket, homeId) => {
  if (!socket) return;
  socket.join(homeId);
  socket.homeId = homeId;
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    homeId: socket.homeId,
  });
  io.to(homeId).emit(events.UPDATE_HOME);
};

const onLeaveHomeEvent = (io, socket, homeId) => {
  socket.leave(homeId);
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    homeId: null,
  });
  io.to(homeId).emit(events.UPDATE_HOME);
  io.to(socket.id).emit(events.LEAVE_HOME);
};

const onSendNotificationEvent = (io, homeId) => {
  io.to(homeId).emit(events.NOTIFY);
};

const onUpdateExpensesEvent = (io, homeId) => {
  io.to(homeId).emit(events.UPDATE_EXPENSES);
};

const createEventListeners = (socket, io) => {
  socket.on(events.DELETE_SESSION, ({ sessionId }) =>
    sessionStore.removeSession(sessionId)
  );
  socket.on(events.DISCONNECT, () => onDisconnectEvent(socket));
};

const registerHomeEvents = (socket, io) => {
  socket.on(events.JOIN_HOME, (homeId) => onJoinHomeEvent(io, socket, homeId));
  socket.on(events.ACCEPT_JOIN_REQ, ({ homeId, userId }) =>
    io.to(userId).emit(events.JOIN_HOME, homeId)
  );
  socket.on(events.LEAVE_HOME, (homeId) =>
    onLeaveHomeEvent(io, socket, homeId)
  );

  socket.on(events.SEND_NOTIFICATION, (homeId) =>
    onSendNotificationEvent(io, homeId)
  );

  socket.on(events.UPDATE_EXPENSES, (homeId) =>
    onUpdateExpensesEvent(io, homeId)
  );
};

export { sessionStore, createEventListeners, registerHomeEvents };
