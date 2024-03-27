import React, { useState, useEffect } from 'react';
import { useHome } from '../../context/HomeContext';

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
  const [houseMembers, setHouseMembers] = useState<string[]>([]);
  const home = useHome();
  
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
    <div className='popup-overlay' style={{ zIndex: 1 }}>
      <div className='popup'>
        <h2>Create Chore</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <label htmlFor='title' style={{ marginBottom: '0.5rem' }}>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
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
              value={formData.assignedTo}
              onChange={handleChange}
              required
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
            <input
              type='date'
              id='dueDate'
              name='dueDate'
              value={dueDateAsString}
              onChange={handleDueDateChange}
              min={today}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
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
