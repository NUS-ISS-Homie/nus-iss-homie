import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePopup from './ExpensesAddPopUp';
import EditPopup from './ExpensesEditPopUp';
import DeletePopup from './ExpensesDeletePopUp';
import '../../CSS/ExpenseMainPage.css'; // Import the CSS file
import { URI_BACKEND } from '../../configs';

// Define Expense interface
interface Expense {
  _id: number;
  title: string;
  amount: number;
  category: string;
  username: string;
}

function ExpenseMainPage() {
  // State variables for managing expenses and pop-up visibility
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Function to fetch expenses from the backend API
  useEffect(() => {
    axios
      .get(URI_BACKEND + '/api/expense')
      .then((response) => {
        setExpenses(response.data.expenses);
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
      });
  }, []);

  // Function to handle opening the create pop-up
  const openCreatePopup = () => {
    setCreateOpen(true);
  };

  // Function to handle opening the edit pop-up
  const openEditPopup = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  // Function to handle opening the delete pop-up
  const openDeletePopup = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteOpen(true);
  };

  // Function to handle submitting new expense data
  const handleSubmit = (formData: any) => {
    axios
      .post(URI_BACKEND + '/api/expense/create', formData)
      .then((response) => {
        setExpenses([...expenses, response.data]);
      })
      .catch((error) => {
        console.error('Error creating expense:', error);
      });
  };

  // Function to handle editing an expense
  const handleEdit = (editedExpense: Expense) => {
    axios
      .put(URI_BACKEND + `/api/expense/${editedExpense._id}`, editedExpense)
      .then(() => {
        const updatedExpenses = expenses.map((expense) =>
          expense._id === editedExpense._id ? editedExpense : expense
        );
        setExpenses(updatedExpenses);
      })
      .catch((error) => {
        console.error('Error editing expense:', error);
      });
  };

  // Function to handle deleting an expense
  const handleDelete = () => {
    if (selectedExpense) {
      console.log(selectedExpense._id);
      axios
        .delete(URI_BACKEND + `/api/expense/${selectedExpense._id}`)
        .then(() => {
          const updatedExpenses = expenses.filter(
            (expense) => expense._id !== selectedExpense._id
          );
          setExpenses(updatedExpenses);
        })
        .catch((error) => {
          console.error('Error deleting expense:', error);
        });
    }
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
              <td>{expense.username}</td>
              <td className='expense-buttons'>
                {/* Edit button */}
                <button onClick={() => openEditPopup(expense)}>Edit</button>
                {/* Delete button */}
                <button onClick={() => openDeletePopup(expense)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCreateOpen && (
        <CreatePopup
          onClose={() => setCreateOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {/* Pass selectedExpense and handleEdit to the edit popup */}
      {isEditOpen && selectedExpense && (
        <EditPopup
          expense={selectedExpense}
          onClose={() => setEditOpen(false)}
          onEdit={handleEdit}
        />
      )}
      {/* Pass selectedExpense and handleDelete to the delete popup */}
      {isDeleteOpen && selectedExpense && (
        <DeletePopup
          expenseId={selectedExpense._id} // Pass the _id instead of the entire expense
          onClose={() => setDeleteOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ExpenseMainPage;
