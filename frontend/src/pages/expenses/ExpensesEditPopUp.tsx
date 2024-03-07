import React, { useState } from 'react';
import { Expense } from './type';

interface EditPopupProps {
  expense: Expense;
  onClose: () => void;
  onEdit: (editedExpense: Expense) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ expense, onClose, onEdit }) => {
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editedExpense);
    onClose();
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
          <div>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              name='username'
              value={editedExpense.username}
              readOnly
              required
              style={{
                backgroundColor: '#f2f2f2',
                color: '#666',
                cursor: 'not-allowed',
              }} // Apply styling here
            />
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
