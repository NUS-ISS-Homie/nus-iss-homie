import React, { useState } from 'react';
import { Chore } from '../../../@types/Chore';

interface EditPopupProps {
  isAdmin: boolean;
  user_id: any;
  home: any;
  chore: Chore;
  houseMembers: string[];
  onClose: () => void;
  onEdit: (editedChore: Chore) => void;
  today: any;
}

const EditPopup: React.FC<EditPopupProps> = ({
  chore,
  onClose,
  onEdit,
  houseMembers,
  isAdmin,
  today,
}) => {
  const [editedChore, setEditedChore] = useState<Chore>(chore);
  const [scheduledDateAsString, setScheduleDateAsString] = useState<string>(
    chore.scheduledDate
      ? new Date(chore.scheduledDate).toISOString().split('T')[0]
      : ''
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedChore({ ...editedChore, [name]: value });
  };
  const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setScheduleDateAsString(selectedDate);

    setEditedChore({
      ...editedChore,
      scheduledDate: new Date(selectedDate),
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editedChore);
    onClose();
  };

  return (
    <div className='popup-overlay' style={{ zIndex: 1 }}>
      <div className='popup'>
        <h2>Edit Chore</h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <label htmlFor='title' style={{ marginBottom: '0.5rem' }}>
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={editedChore.title}
              onChange={handleChange}
              required
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <label htmlFor='assignedTo' style={{ marginBottom: '0.5rem' }}>
              Assigned To
            </label>
            <select
              id='assignedTo'
              name='assignedTo'
              value={editedChore.assignedTo}
              onChange={handleChange}
              required
              disabled={!isAdmin}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            >
              <option value='' disabled>
                Select member
              </option>
              {houseMembers.map((person, index) => (
                <option key={index} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <label htmlFor='scheduledDate' style={{ marginBottom: '0.5rem' }}>
              Scheduled Date
            </label>
            {scheduledDateAsString && (
              <input
                type='date'
                id='scheduledDate'
                name='scheduledDate'
                value={scheduledDateAsString}
                onChange={handleScheduleDateChange}
                min={today}
                required
                disabled={!isAdmin}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
            )}
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
