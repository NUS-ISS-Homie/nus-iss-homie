const onDisconnectEvent = (socket) => {
  console.log(`Disconnected with ${socket.id}`);
};

const onJoinHomeEvent = (io, socket, homeId) => {
  // subscribes to home for notifications
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

const onSendNotificationEvent = (io, notification) => {
  io.to(notification.homeId).emit('notify', notification.message);
};

const createEventListeners = (socket, io) => {
  socket.on('join-home', (homeId) => onJoinHomeEvent(io, socket, homeId));
  socket.on('disconnect', () => onDisconnectEvent(socket));
};

export default createEventListeners;
