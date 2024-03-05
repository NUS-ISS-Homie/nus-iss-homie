// Import necessary modules
import mongoose from 'mongoose';

// Define a Mongoose schema
const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  category: String,
  amount: Number,
  description: String,
});

// Create a Mongoose model based on the schema
const Expense = mongoose.model('Expense', expenseSchema);

// Connect to MongoDB
mongoose.connect(DB_CLOUD_URI + '/expenseDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Insert data
const newExpense = new Expense({
  category: 'Groceries',
  amount: 50.25,
  description: 'Weekly grocery shopping',
});

newExpense.save((err, expense) => {
  if (err) {
    console.error('Error saving expense:', err);
  } else {
    console.log('Expense saved successfully:', expense);
  }
});
