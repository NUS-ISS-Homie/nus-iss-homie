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
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Create Expense</h2>
        <form onSubmit={handleSubmit}>
          <div>
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
          <div>
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
          <div>
            <label htmlFor='category'>Category</label>
            <input
              type='text'
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
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
