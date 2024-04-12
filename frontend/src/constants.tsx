export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_NOT_FOUND = 404;
export const STATUS_CONFLICT = 409;
export const STATUS_SERVER_ERROR = 500;

export const NOTIFICATION_JOIN_REQ = '[HOME JOIN REQUEST]';
export const NOTIFICATION_INVITE = '[HOME INVITE]';
export const NOTIFICATION_CHORE_REMINDER = '[CHORE REMINDER]';
export const NOTIFICATION_NEW_CHORE = '[NEW CHORE]';
export const NOTIFICATION_EDITED_CHORE = '[EDITED CHORE]';
export const NOTIFICATION_CHORE_SWAP_REQUEST = '[CHORE SWAP REQUEST]';
export const NOTIFICATION_CHORE_SWAP_REQUEST_RESULT =
  '[CHORE SWAP REQUEST RESULT]';

export const homeSocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  SESSION: 'session',
  DELETE_SESSION: 'delete-session',

  // Home events
  JOIN_HOME: 'join-home',
  UPDATE_HOME: 'update-home',
  LEAVE_HOME: 'leave-home',
  ACCEPT_JOIN_REQ: 'accept-join-req',

  // Socket events
  UPDATE_EXPENSES: 'update-expenses',
  UPDATE_GROCERIES: 'update-groceries',
  UPDATE_CHORES: 'update-chores',

  // Notification events
  SEND_NOTIFICATION: 'send-notification',
  NOTIFY: 'notify',
};
