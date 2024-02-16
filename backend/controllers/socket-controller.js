const onDisconnectEvent = (socket) => {
    console.log(`Disconnected with ${socket.id}`);
};

const createEventListeners = (socket, io) => {
    socket.on('disconnect', () => onDisconnectEvent(socket));
};

export default createEventListeners;