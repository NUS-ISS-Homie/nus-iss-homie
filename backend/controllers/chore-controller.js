import * as constants from '../common/messages.js';
import {
  ormCreateChore as _createChore,
  ormGetChore as _getChore,
  ormUpdateChore as _updateChore,
  ormDeleteChore as _deleteChore,
  ormGetAllChores as _getAllChores
} from '../models/chore/chore-orm.js';
import mongoose from 'mongoose';

export const entity = 'chore';

export async function getAllChores(_,res) {
  try {
    const chores = await _getAllChores(); // Call the function to fetch all chores from the database
    if (!chores || chores.length === 0) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'No chores found' });
    }
    return res.status(constants.STATUS_CODE_OK).json({ chores });
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function createChore(req, res) {
  try {
    const { title, assignedTo, dueDate } = req.body;
    console.log('createChore ', title, assignedTo, dueDate);

    if (title && assignedTo && dueDate) {
      const newChore = await _createChore({
        title,
        assignedTo,
        dueDate,
      });
      return res.status(constants.STATUS_CODE_CREATED).json({
        message: constants.SUCCESS_CREATE('chore', title),
      }); // Pass 'chore' as entity and newChore.title as the parameter
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(choreId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Chore not found' });
    }

    const chore = await _getChore(choreId);
    console.log('chore: ', chore);
    if (!chore) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }
    return res.status(constants.STATUS_CODE_OK).json({ chore });
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function updateChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(choreId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Chore not found' });
    }
    const updatedFields = req.body;
    if (choreId && Object.keys(updatedFields).length > 0) {
      const updatedChore = await _updateChore(choreId, updatedFields);
      if (!updatedChore) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }
      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_UPDATE(entity, 'Updated Chore') });
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function deleteChore(req, res) {
  try {
    const { choreId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(choreId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Chore not found' });
    }
    if (choreId) {
      const isDeleted = await _deleteChore(choreId);
      if (!isDeleted) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }
      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_DELETE(entity) });
    } else {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}
