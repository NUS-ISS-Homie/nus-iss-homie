import express from 'express';
import {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expense-controller.js';

const router = express.Router();

router.post('/', createExpense);
router.get('/:expenseId', getExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;
