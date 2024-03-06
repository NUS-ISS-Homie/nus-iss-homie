import {
  ormCreateUser as _createUser,
  ormGetUser as _getUser,
  ormChangePassword as _changePassword,
  ormChangeUsername as _changeUsername,
  ormDeleteUser as _deleteUser,
} from '../models/user/user-orm.js';
import * as constants from '../common/messages.js';
import bcrypt from 'bcrypt';

export const entity = 'user';

function isDuplicateError(err) {
  const duplicateError = { name: 'MongoServerError', code: 11000 };
  return err.name === duplicateError.name && err.code === duplicateError.code;
}

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    let saltRounds = parseInt(process.env.SALT_ROUNDS);

    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const resp = await _createUser(username, hashedPassword);
      if (resp.err) {
        if (
          resp.err.name &&
          resp.err.name === 'MongoServerError' &&
          resp.err.code === 11000
        ) {
          return res
            .status(constants.STATUS_CODE_DUPLICATE)
            .json({ message: constants.FAIL_DUPLICATE(entity, username) });
        }
        return res
          .status(constants.STATUS_CODE_BAD_REQUEST)
          .json({ message: 'Could not create a new user!' });
      } else {
        return res
          .status(constants.STATUS_CODE_CREATED)
          .json({ message: constants.SUCCESS_CREATE(entity, username) });
      }
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function signIn(req, res) {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    if (username && password) {
      const user = await _getUser(username);
      if (!user) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }

      if (user.err) {
        return res
          .status(constants.STATUS_CODE_BAD_REQUEST)
          .json({ message: 'Could not sign in!' });
      }

      const isPasswordCorrect = user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res
          .status(constants.STATUS_CODE_UNAUTHORIZED)
          .json({ message: constants.FAIL_UNAUTHORIZED });
      }
      return res.status(constants.STATUS_CODE_OK).json({
        username: username,
        user_id: user._id,
      });
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    console.log(err);
    return res.status(constants.STATUS_CODE_SERVER_ERROR).json(err);
  }
}

export async function changePassword(req, res) {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (username && oldPassword && newPassword) {
      const user = await _getUser(username);

      if (!user) {
        return res
          .status(constants.STATUS_CODE_BAD_REQUEST)
          .json({ message: constants.FAIL_INCORRECT_FIELDS });
      }

      let saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      const isPasswordCorrect = user.comparePassword(oldPassword);
      if (!isPasswordCorrect) {
        return res
          .status(constants.STATUS_CODE_UNAUTHORIZED)
          .json({ message: constants.FAIL_UNAUTHORIZED });
      }

      const updated = await _changePassword(
        username,
        oldPassword,
        hashedNewPassword
      );

      if (!updated || updated.err) {
        return res
          .status(constants.STATUS_CODE_BAD_REQUEST)
          .json({ message: constants.FAIL_INCORRECT_FIELDS });
      }

      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_UPDATE(entity, 'password') });
    }
    return res
      .status(constants.STATUS_CODE_BAD_REQUEST)
      .json({ message: constants.FAIL_MISSING_FIELDS });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function changeUsername(req, res) {
  try {
    const { username, newUsername, password } = req.body;
    if (username && newUsername && password) {
      const user = await _getUser(username);

      if (!user) {
        return res
          .status(constants.STATUS_CODE_BAD_REQUEST)
          .json({ message: constants.FAIL_INCORRECT_FIELDS });
      }

      const isPasswordCorrect = user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res
          .status(constants.STATUS_CODE_UNAUTHORIZED)
          .json({ message: constants.FAIL_INCORRECT_FIELDS });
      }

      const updated = await _changeUsername(username, newUsername, password);

      if (updated.err) {
        if (isDuplicateError(updated.err)) {
          return res
            .status(constants.STATUS_CODE_DUPLICATE)
            .json({ message: constants.FAIL_DUPLICATE(entity, username) });
        }

        return res
          .status(constants.STATUS_CODE_SERVER_ERROR)
          .json({ message: constants.FAIL_DATABASE_ERROR });
      }

      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_UPDATE(entity, 'username') });
    }
    return res
      .status(constants.STATUS_CODE_BAD_REQUEST)
      .json({ message: constants.FAIL_MISSING_FIELDS });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function deleteUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const isDeleted = await _deleteUser(username, password);
      if (!isDeleted || isDeleted.err) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }
      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_DELETE(entity, username) });
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}
