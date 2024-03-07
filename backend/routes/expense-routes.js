import express from 'express';
import {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getAllExpenses, // Add this import
} from '../controllers/expense-controller.js';

const router = express.Router();

// Controller will contain all the Expense-defined Routes
router.get('/', getAllExpenses); // Modify this route to get all expenses

router.post('/create', createExpense);
router.get('/:expenseId', getExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;
