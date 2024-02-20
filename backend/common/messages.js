// Status code constants
export const STATUS_CODE_OK = 200;
export const STATUS_CODE_CREATED = 201;
export const STATUS_CODE_BAD_REQUEST = 400;
export const STATUS_CODE_UNAUTHORIZED = 401;
export const STATUS_CODE_NOT_FOUND = 404;
export const STATUS_CODE_SERVER_ERROR = 500;

// Messages constants
export const SUCCESS_CREATE = (entity) => `Successfully created ${entity}!`;
export const SUCCESS_READ = (entity) => `Successfully obtained ${entity}!`;
export const SUCCESS_UPDATE = (entity) => `Successfully updated ${entity}!`;
export const SUCCESS_DELETE = (entity) => `Successfully deleted ${entity}!`;
export const SUCCESS_ACTION = (action, entity) =>
  `Successfully ${action} ${entity}!`;

export const ERR_NOT_FOUND = (entity) => `${entity} not found!`;
export const ERR_MISSING_PARAMS = (params) => `Missing ${params}!`;
