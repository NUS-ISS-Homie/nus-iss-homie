import React, { useEffect, useState } from 'react';
import { Chore } from '../../@types/ChoreType';
import { useHome } from '../../context/HomeContext';
import { useUser } from '../../context/UserContext';

interface EditPopupProps {
  chore: Chore;
  onClose: () => void;
  onEdit: (editedChore: Chore) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ chore, onClose, onEdit }) => {
  const [editedChore, setEditedChore] = useState<Chore>(chore);
  const [dueDateAsString, setDueDateAsString] = useState<string>(chore.dueDate ? new Date(chore.dueDate).toISOString().split('T')[0] : '2024-10-10');
  const today = new Date().toISOString().split('T')[0]; 
  const home = useHome();
  const { user_id } = useUser();
  const [houseMembers, setHouseMembers] = useState<string[]>([]);
  const isAdmin = home?.adminUser?._id === user_id && user_id !== null;

  useEffect(() => {
    if (!home) return;
    console.log('HOME', home);
  
    // Extract usernames from the array of objects
    const usernames = home.users.map(({ username }) => username);
    console.log('usernames:', usernames);
  
    // Set the state with the array of usernames
    setHouseMembers(usernames);
  }, [home]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className='popup-overlay' style={{zIndex : 1}}>
      <div className='popup'>
        <h2>Edit Chore</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <label htmlFor='title' style={{ marginBottom: '0.5rem' }}>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={editedChore.title}
              onChange={handleChange}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <label htmlFor='assignedTo' style={{ marginBottom: '0.5rem' }}>Assigned To</label>
            <select
              id='assignedTo'
              name='assignedTo'
              value={editedChore.assignedTo}
              onChange={handleChange}
              required
              disabled={!isAdmin}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value='' disabled>Select member</option>
              {houseMembers.map((person, index) => (
                <option key={index} value={person}>{person}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <label htmlFor='dueDate' style={{ marginBottom: '0.5rem' }}>Due Date</label>
            {dueDateAsString && <input
              type='date'
              id='dueDate'
              name='dueDate'
              value={dueDateAsString}
              onChange={handleDueDateChange}
              min={today}
              required
              disabled={!isAdmin}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
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
