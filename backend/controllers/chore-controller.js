import * as constants from '../common/messages.js';
import {
  ormCreateChore as _createChore,
  ormGetChore as _getChore,
  ormGetChoresByHomeId as _getChoresByHomeId,
  ormGetChoresByNotificationId as _getChoresByNotificationId,
  ormGetChoresScheduledToday as _getChoresScheduledToday,
  ormUpdateChore as _updateChore,
  ormDeleteChore as _deleteChore,
} from '../models/chore/chore-orm.js';

export const entity = 'chore';

export async function createChore(req, res) {
  try {
    const { title, assignedTo, scheduledDate, home } = req.body;

    if (title && assignedTo && scheduledDate && home) {
      const chore = await _createChore(req.body);
      return res.status(constants.STATUS_CODE_CREATED).json({
        chore,
        message: constants.SUCCESS_CREATE('chore', title),
      });
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

export async function getChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!choreId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const chore = await _getChore(choreId);
    if (!chore || chore.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res.status(constants.STATUS_CODE_OK).json({ chore });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getChoresByHomeId(req, res) {
  try {
    const { homeId } = req.params;
    if (!homeId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
    const chores = await _getChoresByHomeId(homeId);
    if (!chores || chores.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res.status(constants.STATUS_CODE_OK).json({ chores });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getChoresByNotificationId(req, res) {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
    const chores = await _getChoresByNotificationId(notificationId);
    if (!chores || chores.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res.status(constants.STATUS_CODE_OK).json({ chores });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getChoresScheduledToday(req, res) {
  try {
    const chores = await _getChoresScheduledToday();
    return chores;
  } catch (error) {
    console.error('Error retrieving chores:', error);
    return res.status(500).json({ message: 'Failed to retrieve chores' });
  }
}

export async function updateChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!choreId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const updatedFields = req.body;
    if (Object.keys(updatedFields).length > 0) {
      const updatedChore = await _updateChore(choreId, updatedFields);
      if (!updatedChore) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }
      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_UPDATE(entity) });
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

export async function deleteChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!choreId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const deleted = await _deleteChore(choreId);
    if (!deleted || deleted.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res
      .status(constants.STATUS_CODE_OK)
      .json({ message: constants.SUCCESS_DELETE(entity) });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getAllChoresDueToday(_, res) {
  try {
    const choresDueToday = await _getAllChoresDueToday();
    //console.log('choresDueToday: ', choresDueToday);
    return choresDueToday;
  } catch (err) {
    console.error(err);
  }
}
