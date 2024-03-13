import React, { useState } from 'react';
import { Chore } from './ChoreType';

interface EditPopupProps {
  chore: Chore;
  onClose: () => void;
  onEdit: (editedChore: Chore) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ chore, onClose, onEdit }) => {
  const [editedChore, setEditedChore] = useState<Chore>(chore);
  const [dueDateAsString, setDueDateAsString] = useState<string>(chore.dueDate ? new Date(chore.dueDate).toISOString().split('T')[0] : '2024-10-10');
  const today = new Date().toISOString().split('T')[0]; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedChore({ ...editedChore, [name]: value });
  };
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDueDateAsString(selectedDate);

    setEditedChore({
      ...editedChore,
      dueDate: new Date(selectedDate),
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editedChore);
    onClose();
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Edit Chore</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={editedChore.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='assignedTo'>Assigned To</label>
            <input
              type='text'
              id='assignedTo'
              name='assignedTo'
              value={editedChore.assignedTo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='dueDate'>Due Date</label>
            {dueDateAsString && <input
              type='date'
              id='dueDate'
              name='dueDate'
              value={dueDateAsString}
              onChange={handleDueDateChange}
              min={today}
              required
            />}
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
