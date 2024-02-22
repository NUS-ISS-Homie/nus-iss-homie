// Status code constants
export const STATUS_CODE_OK = 200;
export const STATUS_CODE_CREATED = 201;
export const STATUS_CODE_BAD_REQUEST = 400;
export const STATUS_CODE_UNAUTHORIZED = 401;
export const STATUS_CODE_NOT_FOUND = 404;
export const STATUS_CODE_SERVER_ERROR = 500;
export const STATUS_CODE_DUPLICATE = 409;

// Messages constants
export const SUCCESS_CREATE = (entity, field = '') =>
  `Successfully created ${entity} ${field}`;
export const SUCCESS_READ = (entity) => `Successfully obtained ${entity}`;
export const SUCCESS_UPDATE = (entity, field = '') =>
  `Successfully updated ${entity} ${field}`;
export const SUCCESS_DELETE = (entity, field = '') =>
  `Successfully deleted ${entity} ${field}`;
export const SUCCESS_ACTION = (action, entity) =>
  `Successfully ${action} ${entity}`;

export const FAIL_MISSING_FIELDS = 'Missing field(s)';
export const FAIL_INCORRECT_FIELDS = 'Incorrect field(s)';
export const FAIL_DATABASE_ERROR = 'Database failure';
export const FAIL_DUPLICATE = (entity, field = '') =>
  `${entity} ${field} duplicated / not exists!`;
export const FAIL_NOT_EXIST = (entity) => `${entity} does not exist`;
