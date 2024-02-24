import express from 'express';
import {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expense-controller.js';

const router = express.Router();

// Controller will contain all the Expense-defined Routes
router.get('/', (_, res) => res.send('Hello World from expense-service'));

router.post('/create', createExpense);
router.get('/:expenseId', getExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;
