const URI_HOME_SVC = 'http://localhost:8000';
const PREFIX_HOME_SVC = '';

export const URL_HOME_SVC = URI_HOME_SVC + PREFIX_HOME_SVC;

const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000';

const PREFIX_USER_SVC = '/api/user';

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

export const USER_SIGNUP = '/signup';
export const USER_LOGIN = '/login';
export const USER_LOGOUT = '/logout';
export const USER_CHANGE_PASSWORD = '/change-password';
export const USER_CHANGE_USERNAME = '/change-username';
export const USER_DELETE_USER = '/delete-user';

export const URL_USER_SIGNUP = URL_USER_SVC + USER_SIGNUP;
export const URL_USER_LOGIN = URL_USER_SVC + USER_LOGIN;
export const URL_USER_LOGOUT = URL_USER_SVC + USER_LOGOUT;
export const URL_USER_CHANGE_PASSWORD = URL_USER_SVC + USER_CHANGE_PASSWORD;
export const URL_USER_CHANGE_USERNAME = URL_USER_SVC + USER_CHANGE_USERNAME;
export const URL_USER_DELETE_USER = URL_USER_SVC + USER_DELETE_USER;

export const LOCAL_STORAGE_USERNAME_KEY = 'username';
