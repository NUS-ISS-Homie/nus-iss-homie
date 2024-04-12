import {
  ExpenseResponse,
  ExpensesResponse,
  NewExpense,
  UpdateExpense,
} from '../@types/Expense';
import { URL_EXPENSE_SVC } from '../configs';
import { API, requests } from './api-request';

const APIExpense = {
  createExpense: (
    expense: NewExpense
  ): Promise<API.Response<ExpenseResponse>> => {
    return requests.post(URL_EXPENSE_SVC, '', expense);
  },

  getExpense: (expenseId: string): Promise<API.Response<ExpenseResponse>> => {
    return requests.get(URL_EXPENSE_SVC, `/${expenseId}`);
  },

  getExpenses: (homeId: string): Promise<API.Response<ExpensesResponse>> => {
    return requests.put(URL_EXPENSE_SVC, '', { home: homeId });
  },

  updateExpense: (
    updatedExpense: UpdateExpense
  ): Promise<API.Response<ExpenseResponse>> => {
    return requests.put(
      URL_EXPENSE_SVC,
      `/${updatedExpense._id}`,
      updatedExpense
    );
  },

  deleteExpense: (
    expenseId: string
  ): Promise<API.Response<ExpenseResponse>> => {
    return requests.delete(URL_EXPENSE_SVC, `/${expenseId}`, {});
  },
};

export default APIExpense;
