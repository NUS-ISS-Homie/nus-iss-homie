import {
  ormCreateHome as _createHome,
  ormGetHome as _getHome,
  ormJoinHome as _joinHome,
  ormLeaveHome as _leaveHome,
  ormDeleteHome as _deleteHome,
} from '../models/home/home-orm.js';
import * as msg from '../common/messages.js';
import { FAIL_NOT_TENANT } from '../models/home/home-messages.js';

export const entity = 'home';

export async function createHome(req, res) {
  try {
    const { adminUser } = req.body;

    if (!adminUser) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const home = await _createHome(adminUser);
    if (!home || home.error) {
      console.log(res);
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: res.message });
    }

    return res
      .status(msg.STATUS_CODE_CREATED)
      .json({ home, message: msg.SUCCESS_CREATE(entity) });
  } catch (err) {
    return res
      .status(msg.STATUS_CODE_SERVER_ERROR)
      .json({ message: msg.FAIL_DATABASE_ERROR });
  }
}

export async function getHome(req, res) {
  try {
    const { homeId } = req.params;

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }
    const home = await _getHome(homeId);
    if (!home || home.error) {
      console.log(home);
      return res
        .status(msg.STATUS_CODE_NOT_FOUND)
        .json({ message: msg.FAIL_NOT_EXIST(entity) });
    }
    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home, message: msg.SUCCESS_READ(entity) });
  } catch (err) {
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function joinHome(req, res) {
  try {
    const { homeId } = req.params;
    const { username } = req.body;

    if (!homeId || !username) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const home = await _joinHome(homeId, username);
    if (!home || home.error) {
      console.log(home);
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home, message: msg.SUCCESS_ACTION('joined', entity) });
  } catch (err) {
    console.log('Error home: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function leaveHome(req, res) {
  try {
    const { homeId } = req.params;
    const { username } = req.body;

    if (!homeId || !username) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    const home = await _getHome(homeId);
    if (!home.users.includes(username)) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: FAIL_NOT_TENANT });
    }

    const updatedHome = await _leaveHome(homeId, username);
    if (!updatedHome || updatedHome.err) {
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: msg.FAIL_DATABASE_ERROR });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home: updatedHome, message: msg.SUCCESS_ACTION('left', entity) });
  } catch (err) {
    console.log('Error home: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function deleteHome(req, res) {
  try {
    const { homeId } = req.params;
    const { username } = req.body;

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.FAIL_MISSING_FIELDS });
    }

    // Check if home exists
    const home = await _getHome(homeId);
    if (!home) {
      return res
        .status(msg.STATUS_CODE_NOT_FOUND)
        .json({ message: msg.FAIL_NOT_EXIST(entity) });
    }

    // Check if user is admin
    if (home.adminUser != username) {
      return res
        .status(msg.STATUS_CODE_UNAUTHORIZED)
        .json({ message: msg.FAIL_UNAUTHORIZED });
    }

    const resp = await _deleteHome(homeId);
    if (!resp || resp.err) {
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: msg.FAIL_DATABASE_ERROR });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home: resp, message: msg.SUCCESS_DELETE(entity) });
  } catch (err) {
    console.log('Error home: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}
