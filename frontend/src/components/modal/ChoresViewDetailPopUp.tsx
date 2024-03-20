interface choreViewDetailProps {
  selectedChore: any
  openEditPopup: any
  setIsViewDetailsOpen: any
  openDeletePopup: any
}

const ChoreViewDetail: React.FC<choreViewDetailProps> = ({selectedChore, openEditPopup, setIsViewDetailsOpen, openDeletePopup}) => {
  return (
    <div className='popup-overlay' style={{ zIndex: 1 }}>
      <div className='popup' style={{position:'relative'}}>
        <button className="close-button" 
        style={{ 
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: '#555'
        }}
        onClick={() => setIsViewDetailsOpen(false)}>x</button>
        <h2>{selectedChore?.title}</h2>
        <p>Assigned To: {selectedChore?.assignedTo}</p>
        <p>Date: {selectedChore?.dueDate ? new Date(selectedChore.dueDate).toLocaleDateString() : ''}</p>
        {/* Edit and delete buttons (conditionally rendered) */}
        {selectedChore && (
          <div className='expense-buttons'>
            <button onClick={() => {
              openEditPopup(selectedChore);
              setIsViewDetailsOpen(false); // Close the modal after opening the edit popup
            }}>Edit</button>
            <button onClick={() => {
              openDeletePopup(selectedChore);
              setIsViewDetailsOpen(false); // Close the modal after opening the delete popup
            }}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChoreViewDetail;
