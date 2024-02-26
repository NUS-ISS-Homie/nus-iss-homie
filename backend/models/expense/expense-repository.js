import ExpenseModel from './expense-model.js'; // Import Mongoose model for expenses
import 'dotenv/config';
import mongoose from 'mongoose';

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
    console.log('Creating expense');
    return await ExpenseModel.create({
      title: params.title,
      amount: params.amount,
      category: params.category,
      username: params.username,
    });
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function getExpense(expenseId) {
  try {
    return await ExpenseModel.findById(expenseId);
  } catch (err) {
    console.log(`ERROR: Could not get expense from DB.`);
    return { err };
  }
}

// UPDATE FUNCTION
export async function updateExpense(expenseId, updatedFields) {
  try {
    return await ExpenseModel.findByIdAndUpdate(expenseId, updatedFields, {
      new: true,
    });
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function deleteExpense(expenseId) {
  try {
    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);
    return deletedExpense ? true : false;
  } catch (err) {
    return { err };
  }
}
