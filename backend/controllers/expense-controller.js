import * as constants from '../common/messages.js';
import {
  ormCreateExpense as _createExpense,
  ormGetExpense as _getExpense,
  ormGetExpenses as _getExpenses,
  ormUpdateExpense as _updateExpense,
  ormDeleteExpense as _deleteExpense,
} from '../models/expense/expense-orm.js';

export const entity = 'expense';

export async function createExpense(req, res) {
  try {
    const { title, amount, category, user } = req.body;

    if (title && amount && category && user) {
      const expense = await _createExpense(req.body);
      return res.status(constants.STATUS_CODE_CREATED).json({
        expense,
        message: constants.SUCCESS_CREATE('expense', title),
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

export async function getExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!expenseId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const expense = await _getExpense(expenseId);
    if (!expense || expense.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res.status(constants.STATUS_CODE_OK).json({ expense });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function getExpenses(req, res) {
  try {
    const { title, user, home, category } = req.body;

    if (!title && !user && !home && !category) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const expenses = await _getExpenses(req.body);
    if (!expenses || expenses.err) {
      return res
        .status(constants.STATUS_CODE_NOT_FOUND)
        .json({ message: constants.FAIL_NOT_EXIST(entity) });
    }

    return res.status(constants.STATUS_CODE_OK).json({ expenses });
  } catch (err) {
    return res
      .status(constants.STATUS_CODE_SERVER_ERROR)
      .json({ message: constants.FAIL_DATABASE_ERROR });
  }
}

export async function updateExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!expenseId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const updatedFields = req.body;
    if (Object.keys(updatedFields).length > 0) {
      const updatedExpense = await _updateExpense(expenseId, updatedFields);
      if (!updatedExpense) {
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

export async function deleteExpense(req, res) {
  try {
    const { expenseId } = req.params;
    if (!expenseId) {
      return res
        .status(constants.STATUS_CODE_BAD_REQUEST)
        .json({ message: constants.FAIL_MISSING_FIELDS });
    }

    const deleted = await _deleteExpense(expenseId);
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
