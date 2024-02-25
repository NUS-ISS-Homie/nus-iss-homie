import ExpenseModel from './expense-model.js'; // Import Mongoose model for expenses

// CREATE FUNCTION
export async function ormCreateExpense(object, amount, category, username) {
  try {
    const { title, amount, category, username } = object;

    console.log(
      'ormCreateExpense',
      JSON.stringify({ title, amount, category, username })
    );
    const newExpense = new ExpenseModel({ title, amount, category, username });
    await newExpense.save(); // Just call save() without passing parameters
    return true;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetExpense(expenseId) {
  try {
    console.log('expenseId ' + expenseId);
    const expense = await ExpenseModel.findById(expenseId);
    return expense;
  } catch (err) {
    console.log(err);
    console.log(`ERROR: Could not get expense from DB.`);
    return { err };
  }
}

// UPDATE FUNCTION
export async function ormUpdateExpense(expenseId, updatedFields) {
  try {
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      updatedFields,
      { new: true }
    );
    return updatedExpense;
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function ormDeleteExpense(expenseId) {
  try {
    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);
    return deletedExpense;
  } catch (err) {
    return { err };
  }
}
