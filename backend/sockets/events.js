const events = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  DELETE_SESSION: 'delete-session',

  // Home events
  JOIN_HOME: 'join-home',
  UPDATE_HOME: 'update-home',
  LEAVE_HOME: 'leave-home',
  ACCEPT_JOIN_REQ: 'accept-join-req',

  // Notification events
  SEND_NOTIFICATION: 'send-notification',
  NOTIFY: 'notify',
};

export default events;
