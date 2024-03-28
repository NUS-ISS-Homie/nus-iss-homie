import express from 'express';
import {
  createExpense,
  getExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expense-controller.js';

const router = express.Router();

router.post('/', createExpense);
router.put('/', getExpenses);
router.get('/:expenseId', getExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;
