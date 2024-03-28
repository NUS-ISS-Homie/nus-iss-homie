import { User } from './HomeContext';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  user: User;
  home: string;
}

export interface NewExpense {
  title: string;
  amount: number;
  category: string;
  user: string;
  home: string;
}

export interface UpdateExpense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  user: string;
  home: string;
}

export interface ExpenseResponse {
  expense: Expense;
  message: string;
}

export interface ExpensesResponse {
  expenses: Expense[];
  message: string;
}
