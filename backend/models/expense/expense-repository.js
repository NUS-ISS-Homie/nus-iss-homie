import mongoose from 'mongoose';
import ExpenseModel from './expense-model.js';
import 'dotenv/config';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_CLOUD_URI_TEST;

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// CREATE FUNCTION
export async function createExpense(params) {
  try {
    const expense = await ExpenseModel.create(params);
    return getExpense(expense._id);
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function getExpense(expenseId) {
  try {
    return await ExpenseModel.findById(expenseId).populate({
      path: 'user',
      select: 'username',
    });
  } catch (err) {
    return { err };
  }
}

// UPDATE FUNCTION
export async function updateExpense(expenseId, updatedFields) {
  try {
    return await ExpenseModel.findByIdAndUpdate(expenseId, updatedFields, {
      new: true,
    }).populate({ path: 'user', select: 'username' });
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function deleteExpense(expenseId) {
  try {
    const deletedExpense = await ExpenseModel.findByIdAndDelete(
      expenseId
    ).populate({ path: 'user', select: 'username' });
    return deletedExpense;
  } catch (err) {
    return { err };
  }
}
