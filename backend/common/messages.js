// Status code constants
export const STATUS_CODE_OK = 200;
export const STATUS_CODE_CREATED = 201;
export const STATUS_CODE_BAD_REQUEST = 400;
export const STATUS_CODE_UNAUTHORIZED = 401;
export const STATUS_CODE_NOT_FOUND = 404;
export const STATUS_CODE_SERVER_ERROR = 500;
export const STATUS_CODE_DUPLICATE = 409;

// Messages constants
export const SUCCESS_CREATE = (model, username = "") => `Successfully created ${model} ${username}!`;
export const SUCCESS_READ = (model) => `Successfully obtained ${model}!`;
export const SUCCESS_UPDATE = (model, field = "") => `Successfully updated ${model} ${field}!`;
export const SUCCESS_DELETE = (model, username = "") => `Successfully deleted ${model} ${username}!`;
export const SUCCESS_ACTION = (action, model) => `Successfully ${action} ${model}!`;

export const FAIL_MISSING_FIELDS = "Missing field(s)!"
export const FAIL_INCORRECT_FIELDS = "Some field(s) are incorrect. Please check again!";
export const FAIL_DATABASE_ERROR = "Database failure!";
export const FAIL_DUPLICATE = (model, username = "") => `${model} ${username} duplicated / not exists!`
export const FAIL_NOT_EXIST = (model) => `${model} does not exist!`

