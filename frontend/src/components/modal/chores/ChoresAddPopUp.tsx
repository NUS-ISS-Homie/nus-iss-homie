import React, { useState } from 'react';

interface CreatePopupProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
  houseMembers: string[];
  home: any;
  today: any;
}

const CreatePopup: React.FC<CreatePopupProps> = ({
  onClose,
  onSubmit,
  houseMembers,
  home,
  today,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    scheduledDate: new Date(),
    home: home?._id,
  });

  const [scheduledDateAsString, setScheduledDateAsString] =
    useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleScheduledDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = e.target.value;
    setScheduledDateAsString(selectedDate);

    setFormData({
      ...formData,
      scheduledDate: new Date(selectedDate),
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      assignedTo: '',
      scheduledDate: new Date(),
      home: home?._id,
    });
  };

  return (
    <div className='popup-overlay' style={{ zIndex: 1 }}>
      <div className='popup'>
        <h2>Create Chore</h2>
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
              value={formData.title}
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
              value={formData.assignedTo}
              onChange={handleChange}
              required
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
            <input
              type='date'
              id='scheduledDate'
              name='scheduledDate'
              value={scheduledDateAsString}
              onChange={handleScheduledDateChange}
              min={today}
              required
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100%',
              }}
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
