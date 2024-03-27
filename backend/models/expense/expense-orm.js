import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from './expense-repository.js';

// CREATE FUNCTION
export async function ormCreateExpense(params) {
  try {
    const expense = await createExpense(params);
    await expense.save();
    return expense;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetExpense(expenseId) {
  try {
    const expense = await getExpense(expenseId);
    return expense;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetExpenses(params) {
  try {
    const expense = await getExpenses(params);
    return expense;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// UPDATE FUNCTION
export async function ormUpdateExpense(expenseId, updatedFields) {
  try {
    const updatedExpense = await updateExpense(expenseId, updatedFields);
    return updatedExpense;
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function ormDeleteExpense(expenseId) {
  try {
    const deletedExpense = await deleteExpense(expenseId);
    return deletedExpense;
  } catch (err) {
    return { err };
  }
}
