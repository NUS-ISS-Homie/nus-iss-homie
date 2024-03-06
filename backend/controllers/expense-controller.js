import * as constants from '../common/messages.js';
import bcrypt from 'bcrypt';
import {
  ormCreateExpense as _createExpense,
  ormGetExpense as _getExpense,
  ormUpdateExpense as _updateExpense,
  ormDeleteExpense as _deleteExpense,
} from '../models/expense/expense-orm.js';
import mongoose from 'mongoose';

export const entity = 'expense';

export async function createExpense(req, res) {
  try {
    const { title, amount, category, username } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    console.log('createExpense ', title, amount, category, username);

    if (title && amount && category && username) {
      const newExpense = await _createExpense({
        title,
        amount,
        category,
        username,
      });
      return res.status(constants.STATUS_CODE_CREATED).json({
        message: constants.SUCCESS_CREATE('expense', title),
      }); // Pass 'expense' as entity and newExpense.title as the parameter
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

export async function getExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Expense not found' });
    }

    const expense = await _getExpense(expenseId);
    console.log('expense: ', expense);
    if (!expense) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }
    return res.status(constants.STATUS_CODE_OK).json({ expense });
  } catch (err) {
    console.error(err);
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function updateExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Expense not found' });
    }
    const updatedFields = req.body;
    if (expenseId && Object.keys(updatedFields).length > 0) {
      const updatedExpense = await _updateExpense(expenseId, updatedFields);
      if (!updatedExpense) {
        return res
          .status(constants.STATUS_CODE_NOT_FOUND)
          .json({ message: constants.FAIL_NOT_EXIST(entity) });
      }
      return res
        .status(constants.STATUS_CODE_OK)
        .json({ message: constants.SUCCESS_UPDATE(entity, 'Updated Expense') });
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

export async function deleteExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: 'Expense not found' });
    }
    if (expenseId) {
      const isDeleted = await _deleteExpense(expenseId);
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
