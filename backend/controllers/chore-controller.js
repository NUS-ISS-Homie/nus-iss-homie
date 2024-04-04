import * as constants from '../common/messages.js';
import {
  ormCreateChore as _createChore,
  ormGetChore as _getChore,
  ormGetAllChoresInHome as _getAllChoresInHome,
  ormGetAllChoresDueToday as _getAllChoresDueToday,
  ormUpdateChore as _updateChore,
  ormDeleteChore as _deleteChore,
} from '../models/chore/chore-orm.js';

export const entity = 'chore';

export async function createChore(req, res) {
  try {
    const { title, assignedTo, dueDate, home } = req.body;

    if (title && assignedTo && dueDate && home) {
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

export async function getChores(req, res) {
  try {
    const { home, ...otherParams } = req.body;

    if (Object.keys(otherParams).length > 0) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_INCORRECT_FIELDS });
    }

    if (home) {
      const chores = await _getAllChoresInHome(req.body);
      return res.status(200).json({ chores });
    } else {
      const chores = await _getAllChoresDueToday();
      return res.status(200).json({ chores });
    }
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
