export const URI_BACKEND = 'http://localhost:8000';
const PREFIX_EXPENSE_SVC = '/api/expense';
const PREFIX_HOME_SVC = '/api/home';
const PREFIX_USER_SVC = '/api/user';
const PREFIX_CHORE_SVC = '/api/chore';

const PREFIX_GROCERY_ITEM_SVC = '/api/grocery-item';
const PREFIX_GROCERY_LIST_SVC = '/api/grocery-list';
export const URL_GROCERY_ITEM_SVC = URI_BACKEND + PREFIX_GROCERY_ITEM_SVC;
export const URL_GROCERY_LIST_SVC = URI_BACKEND + PREFIX_GROCERY_LIST_SVC;

const PREFIX_NOTIF_SVC = '/api/notification';

export const SOCKET_NAMESPACE_HOME = 'home';

export const URL_EXPENSE_SVC = URI_BACKEND + PREFIX_EXPENSE_SVC;
export const URL_HOME_SVC = URI_BACKEND + PREFIX_HOME_SVC;
export const URL_USER_SVC = URI_BACKEND + PREFIX_USER_SVC;
export const URL_NOTIF_SVC = URI_BACKEND + PREFIX_NOTIF_SVC;
export const URL_CHORE_SVC = URI_BACKEND + PREFIX_CHORE_SVC;

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

export const LOCAL_STORAGE_USER_KEY = 'user';
export const LOCAL_STORAGE_HOME_KEY = 'home';
export const LOCAL_STORAGE_SOCKET_KEY = 'socket';
export const LOCAL_STORAGE_GROCERY_KEY = 'grocery';
