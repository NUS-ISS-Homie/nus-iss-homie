import React from 'react';

interface choreViewDetailProps {
  selectedChore: any;
  openEditPopup: any;
  setIsViewDetailsOpen: any;
  openDeletePopup: any;
  setIsSwapChoreListOpen: any;
  username: any;
  currentDate: any;
  isAdmin: boolean;
}

const ChoreViewDetail: React.FC<choreViewDetailProps> = ({
  selectedChore,
  openEditPopup,
  setIsViewDetailsOpen,
  openDeletePopup,
  setIsSwapChoreListOpen,
  username,
  currentDate,
  isAdmin,
}) => {
  const currentOrFutureDate =
    new Date(selectedChore.scheduledDate) >= currentDate;
  const choreOwner = selectedChore.assignedTo === username;

  return (
    <div className='popup-overlay' style={{ zIndex: 1 }}>
      <div className='popup' style={{ position: 'relative' }}>
        <button
          className='close-button'
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#555',
          }}
          onClick={() => setIsViewDetailsOpen(false)}
        >
          x
        </button>
        <h2>{selectedChore?.title}</h2>
        <p>Assigned To: {selectedChore?.assignedTo}</p>
        <p>
          Date:{' '}
          {selectedChore?.scheduledDate
            ? new Date(selectedChore.scheduledDate).toLocaleDateString()
            : ''}
        </p>
        {/* Edit and delete buttons (conditionally rendered) */}
        {selectedChore && (
          <div className='expense-buttons'>
            {isAdmin && currentOrFutureDate && (
              <button
                onClick={() => {
                  openEditPopup(selectedChore);
                  setIsViewDetailsOpen(false); // Close the modal after opening the edit popup
                }}
              >
                Edit
              </button>
            )}
            {isAdmin && currentOrFutureDate && (
              <button
                onClick={() => {
                  openDeletePopup(selectedChore);
                  setIsViewDetailsOpen(false); // Close the modal after opening the delete popup
                }}
              >
                Delete
              </button>
            )}
            {choreOwner && currentOrFutureDate && (
              <button
                onClick={() => {
                  setIsSwapChoreListOpen(true);
                  setIsViewDetailsOpen(false); // Close the modal after opening the edit popup
                }}
              >
                Swap Chore
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ChoreViewDetail;
