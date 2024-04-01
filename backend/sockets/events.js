const events = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  SESSION: 'session',
  DELETE_SESSION: 'delete-session',

  // Home events
  JOIN_HOME: 'join-home',
  UPDATE_HOME: 'update-home',
  LEAVE_HOME: 'leave-home',
  ACCEPT_JOIN_REQ: 'accept-join-req',

  // Expense events
  UPDATE_EXPENSES: 'update-expenses',
  UPDATE_GROCERIES: 'update-groceries',

  // Notification events
  SEND_NOTIFICATION: 'send-notification',
  NOTIFY: 'notify',
};

export default events;
