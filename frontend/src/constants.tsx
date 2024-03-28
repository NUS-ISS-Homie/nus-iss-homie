export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_NOT_FOUND = 404;
export const STATUS_CONFLICT = 409;
export const STATUS_SERVER_ERROR = 500;

export const NOTIFICATION_JOIN_REQ = '[HOME JOIN REQUEST]';
export const NOTIFICATION_INVITE = '[HOME INVITE]';

export const homeSocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  DELETE_SESSION: 'delete-session',

  // Home events
  JOIN_HOME: 'join-home',
  UPDATE_HOME: 'update-home',
  LEAVE_HOME: 'leave-home',
  ACCEPT_JOIN_REQ: 'accept-join-req',

  // Socket events
  UPDATE_EXPENSES: 'update-expenses',

  // Notification events
  SEND_NOTIFICATION: 'send-notification',
  NOTIFY: 'notify',
};
