import React from 'react';

interface DeletePopupProps {
  choreId: number; // Change the type to number for the chore ID
  onClose: () => void;
  onDelete: (choreId: number) => void; // Accept chore ID as a parameter
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  choreId,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(choreId); // Pass the expense ID to onDelete
    onClose();
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <h2>Delete Chore</h2>
        <p>
          Are you sure you want to delete the chore with ID "{choreId}"?
        </p>
        <div className='button-container expense-buttons'>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
