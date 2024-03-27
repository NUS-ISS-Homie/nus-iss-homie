import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useHome } from '../../context/HomeContext';
import APIExpense from '../../utils/api-expense';
import { STATUS_CREATED } from '../../constants';
import { useSnackbar } from '../../context/SnackbarContext';

interface CreatePopupProps {
  onClose: () => void;
  updateExpenses: () => void;
}

const CreatePopup: React.FC<CreatePopupProps> = ({
  onClose,
  updateExpenses,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    user: '',
    home: '',
  });

  const { user_id } = useUser();
  const home = useHome();
  const snackbar = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = data.get('title');
    const amount = data.get('amount');
    const category = data.get('category');

    if (!title || !amount || !category || !user_id || !home) return;

    const newExpense = {
      title: title.toString(),
      amount: Number.parseFloat(amount.toString()),
      category: category.toString(),
      user: user_id,
      home: home?._id,
    };

    APIExpense.createExpense(newExpense)
      .then(({ data: { expense, message }, status }) => {
        if (status !== STATUS_CREATED) throw new Error(message);
        updateExpenses();
        onClose();
        user_id &&
          home &&
          setFormData({
            title: '',
            amount: '',
            category: '',
            user: user_id,
            home: home._id,
          });
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Create Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='amount'>Amount</label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='category'>Category</label>
            <select
              id='category'
              name='category'
              value={formData.category}
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
            <button type='submit'>Submit</button>
            <button type='button' onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePopup;
