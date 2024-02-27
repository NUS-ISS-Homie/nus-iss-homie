import {
  ormCreateHome as _createHome,
  ormGetHome as _getHome,
  ormJoinHome as _joinHome,
  ormLeaveHome as _leaveHome,
  ormDeleteHome as _deleteHome,
} from '../models/home/home-orm.js';
import * as msg from '../common/messages.js';

export const entity = 'home';

export async function createHome(req, res) {
  try {
    const { adminUser } = req.body;

    if (!adminUser) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('adminUser') });
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
      .json({ message: 'Database failure when creating new home!' });
  }
}

export async function getHome(req, res) {
  try {
    const { homeId } = req.params;

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: 'Missing home ID' });
    }
    const home = await _getHome(homeId);
    if (!home || home.error) {
      console.log(home);
      return res
        .status(msg.STATUS_CODE_NOT_FOUND)
        .json({ message: msg.ERR_NOT_FOUND(entity) });
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

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('home ID') });
    }

    if (!username) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('user ID') });
    }

    const home = await _joinHome(homeId, username);
    if (!home || home.error) {
      console.log(home);
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: 'Could not join home!' });
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

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('home ID') });
    }

    if (!username) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('user ID') });
    }

    const home = await _leaveHome(homeId, username);
    if (!home || home.err) {
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: 'Could not leave home!' });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home, message: msg.SUCCESS_ACTION('left', entity) });
  } catch (err) {
    console.log('Error home: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}

export async function deleteHome(req, res) {
  try {
    const { homeId } = req.params;

    if (!homeId) {
      return res
        .status(msg.STATUS_CODE_BAD_REQUEST)
        .json({ message: msg.ERR_MISSING_PARAMS('home ID') });
    }

    const home = await _deleteHome(homeId);
    if (!home || home.err) {
      return res
        .status(msg.STATUS_CODE_SERVER_ERROR)
        .json({ message: 'Could not delete home!' });
    }

    return res
      .status(msg.STATUS_CODE_OK)
      .json({ home, message: msg.SUCCESS_DELETE(entity) });
  } catch (err) {
    console.log('Error home: ' + err);
    return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
  }
}
