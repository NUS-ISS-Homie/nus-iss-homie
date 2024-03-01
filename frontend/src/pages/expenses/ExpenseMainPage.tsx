import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePopup from './ExpensesPopUp';
import '../../CSS/ExpenseMainPage.css'; // Import the CSS file
import { URI_BACKEND } from '../../configs';

// Define Expense interface
interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  username: string;
}

function ExpenseMainPage() {
  // State variables for managing expenses and pop-up visibility
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);

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
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.username}</td>
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
    </div>
  );
}

export default ExpenseMainPage;
