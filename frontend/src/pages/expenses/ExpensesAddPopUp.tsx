import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

interface CreatePopupProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const CreatePopup: React.FC<CreatePopupProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    username: '',
  });
  const user = useUser();

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      username: user.username ?? '',
    }));
  }, [user.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      amount: '',
      category: '',
      username: user.username ?? '',
    });
    window.location.reload(); // Refresh the page
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
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              readOnly
              style={{
                backgroundColor: '#f2f2f2',
                color: '#666',
                cursor: 'not-allowed',
              }} // Apply styling here
              required
            />
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
