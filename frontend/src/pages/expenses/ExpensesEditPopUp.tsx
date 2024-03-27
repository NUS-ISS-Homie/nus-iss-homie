import React, { useState } from 'react';
import { Expense } from '../../@types/Expense';
import { useUser } from '../../context/UserContext';
import { useHome } from '../../context/HomeContext';
import APIExpense from '../../utils/api-expense';
import { STATUS_OK } from '../../constants';
import { useSnackbar } from '../../context/SnackbarContext';

interface EditPopupProps {
  expense: Expense;
  onClose: () => void;
  // onEdit: (editedExpense: Expense) => void;
  updateExpenses: () => void;
}

const EditPopup: React.FC<EditPopupProps> = ({
  expense,
  onClose,
  // onEdit,
  updateExpenses,
}) => {
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);

  const { user_id } = useUser();
  const home = useHome();
  const snackbar = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get('title');
    const amount = data.get('amount');
    const category = data.get('category');

    if (!title || !amount || !category || !user_id || !home) return;

    const updatedExpense = {
      _id: editedExpense._id,
      title: title.toString(),
      amount: Number.parseFloat(amount.toString()),
      category: category.toString(),
      user: user_id,
      home: home?._id,
    };

    APIExpense.updateExpense(updatedExpense)
      .then(({ data: { expense, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        updateExpenses();
        onClose();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={editedExpense.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='amount'>Amount</label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={editedExpense.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='category'>Category</label>
            <select
              id='category'
              name='category'
              value={editedExpense.category}
              onChange={handleCategoryChange}
              required
            >
              {/* Options go here */}
              <option value='' disabled>
                Select category
              </option>
              <option value='Food & Dining'>Food & Dining</option>
              <option value='Transportation'>Transportation</option>
              <option value='Housing'>Housing</option>
              <option value='Utilities'>Utilities</option>
              <option value='Entertainment'>Entertainment</option>
              <option value='Health & Fitness'>Health & Fitness</option>
              <option value='Clothing & Accessories'>
                Clothing & Accessories
              </option>
              <option value='Personal Care'>Personal Care</option>
              <option value='Education'>Education</option>
              <option value='Gifts & Donations'>Gifts & Donations</option>
              <option value='Travel'>Travel</option>
              <option value='Insurance'>Insurance</option>
              <option value='Investments'>Investments</option>
              <option value='Taxes'>Taxes</option>
              <option value='Miscellaneous'>Miscellaneous</option>
            </select>
          </div>
          <div className='button-container expense-buttons'>
            <button type='submit'>Save</button>
            <button type='button' onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;
