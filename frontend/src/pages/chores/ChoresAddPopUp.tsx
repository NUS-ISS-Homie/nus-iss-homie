import React, { useState } from 'react';

interface CreatePopupProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const CreatePopup: React.FC<CreatePopupProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    dueDate: new Date(),
  });
  const [dueDateAsString, setDueDateAsString] = useState<string>('');
  const today = new Date().toISOString().split('T')[0]; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDueDateAsString(selectedDate);

    setFormData({
      ...formData,
      dueDate: new Date(selectedDate),
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      assignedTo: '',
      dueDate: new Date(),
    });
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Create Chore</h2>
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
            <label htmlFor='assignedTo'>Assigned To</label>
            <input
              type='text'
              id='assignedTo'
              name='assignedTo'
              value={formData.assignedTo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='dueDate'>Due Date</label>
            <input
              type='date'
              id='dueDate'
              name='dueDate'
              value={dueDateAsString}
              onChange={handleDueDateChange}
              min={today}
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
