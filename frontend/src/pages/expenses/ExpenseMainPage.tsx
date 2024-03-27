import React, { useState, useEffect, useCallback } from 'react';
import CreatePopup from './ExpensesAddPopUp';
import EditPopup from './ExpensesEditPopUp';
import DeletePopup from './ExpensesDeletePopUp';
import '../../CSS/ExpenseMainPage.css';
import { useSnackbar } from '../../context/SnackbarContext';
import APIExpense from '../../utils/api-expense';
import { useHome } from '../../context/HomeContext';
import { STATUS_OK } from '../../constants';
import { Expense } from '../../@types/Expense';
import { useSockets } from '../../context/SocketContext';

function ExpenseMainPage() {
  // State variables for managing expenses and pop-up visibility
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const home = useHome();
  const snackbar = useSnackbar();
  const { homeSocket } = useSockets();

  const updateExpenses = useCallback(() => {
    if (!home) return;
    APIExpense.getExpenses(home._id)
      .then(({ data: { expenses, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        setExpenses(expenses);
      })
      .catch((err) => snackbar.setError(err.message));
  }, [home, snackbar]);

  useEffect(updateExpenses, [updateExpenses]);

  useEffect(() => {
    homeSocket.on('update-expenses', updateExpenses);
    return () => {
      homeSocket.off('update-expenses', updateExpenses);
    };
  }, [homeSocket, updateExpenses]);

  const openCreatePopup = () => {
    setCreateOpen(true);
  };

  const openEditPopup = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  const openDeletePopup = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedExpense) return;
    APIExpense.deleteExpense(selectedExpense._id)
      .then(({ data: { expense, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        const updatedExpenses = expenses.filter(
          (expense) => expense._id !== selectedExpense._id
        );
        setExpenses(updatedExpenses);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div className='expense-buttons add-expense-container'>
        <button onClick={openCreatePopup}>Add Expense</button>
      </div>
      <table className='expense-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Username</th>
            <th>Actions</th> {/* New column for edit and delete buttons */}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.user.username}</td>
              <td className='expense-buttons'>
                <button onClick={() => openEditPopup(expense)}>Edit</button>
                <button onClick={() => openDeletePopup(expense)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCreateOpen && (
        <CreatePopup
          onClose={() => setCreateOpen(false)}
          updateExpenses={updateExpenses}
        />
      )}
      {isEditOpen && selectedExpense && (
        <EditPopup
          expense={selectedExpense}
          onClose={() => setEditOpen(false)}
          updateExpenses={updateExpenses}
        />
      )}
      {isDeleteOpen && selectedExpense && (
        <DeletePopup
          expenseId={selectedExpense._id}
          onClose={() => setDeleteOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ExpenseMainPage;
