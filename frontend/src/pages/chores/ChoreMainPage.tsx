import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePopup from './ChoresAddPopUp';
import EditPopup from './ChoresEditPopUp';
import DeletePopup from './ChoresDeletePopUp';
import '../../CSS/ExpenseMainPage.css'; // Import the CSS file
import { URI_BACKEND } from '../../configs';
import { Chore } from './ChoreType';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import { Modal } from '@mui/material';

function ChoreMainPage() {
  // State variables for managing chores and pop-up visibility
  const [chores, setChores] = useState<Chore[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [refreshChoreList, setRefreshChoreList] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to fetch chores from the backend API

  useEffect(() => {
    axios
      .get(URI_BACKEND + '/api/chore')
      .then((response) => {
        setChores(response.data.chores);
      })
      .catch((error) => {
        console.error('Error fetching chores:', error);
      });
  }, [refreshChoreList]);

  // Function to handle opening the create pop-up
  const openCreatePopup = () => {
    setCreateOpen(true);
  };

  // Function to handle opening the edit pop-up
  const openEditPopup = (chore: Chore) => {
    setSelectedChore(chore);
    setEditOpen(true);
  };

  // Function to handle opening the delete pop-up
  const openDeletePopup = (chore: Chore) => {
    setSelectedChore(chore);
    setDeleteOpen(true);
  };

  // Function to handle submitting new chore data
  const handleSubmit = (formData: any) => {
    axios
      .post(URI_BACKEND + '/api/chore/create', formData)
      .then((response) => {
        setChores([...chores, response.data]);
        setRefreshChoreList((refreshChoreList:any) => !refreshChoreList)
      })
      .catch((error) => {
        console.error('Error creating chore:', error);
      });
  };

  // Function to handle editing an chore
  const handleEdit = (editedChore: Chore) => {
    axios
      .put(URI_BACKEND + `/api/chore/${editedChore._id}`, editedChore)
      .then(() => {
        const updatedChores = chores.map((chore) =>
          chore._id === editedChore._id ? editedChore : chore
        );
        setChores(updatedChores);
      })
      .catch((error) => {
        console.error('Error editing chores:', error);
      });
  };

  // Function to handle deleting an chore
  const handleDelete = () => {
    if (selectedChore) {
      console.log(selectedChore._id);
      axios
        .delete(URI_BACKEND + `/api/chore/${selectedChore._id}`)
        .then(() => {
          const updatedChores = chores.filter(
            (chore) => chore._id !== selectedChore._id
          );
          setChores(updatedChores);
        })
        .catch((error) => {
          console.error('Error deleting chores:', error);
        });
    }
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;;
    const selectedChore = chores.find((chore) => chore._id === eventId);
    setSelectedChore(selectedChore || null);
    setModalOpen(true);
  };

  return (
    <div>
      <h1>Chore Tracker</h1>
      <div className='expense-buttons add-expense-container'>
        <button onClick={openCreatePopup}>Add Chore</button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={chores.map((chore) => ({
          id: String(chore._id),
          title: chore.title,
          start: chore.dueDate, // Assuming chore.dueDate is in ISO format
          extendedProps: {
            assignedTo: chore.assignedTo,
          },
        }))}
        eventContent={(info) => {
          const choreTitle = info.event.title;
          const assignedTo = info.event.extendedProps.assignedTo;
          return (
            <div>
              <p>{choreTitle}</p>
              <p>Assigned To: {assignedTo}</p>
            </div>
          );
        }}
        eventClick={handleEventClick}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className='popup'>
          <h2>{selectedChore?.title}</h2>
          <p>Assigned To: {selectedChore?.assignedTo}</p>
          <p>Date: {selectedChore?.dueDate ? new Date(selectedChore.dueDate).toLocaleDateString() : ''}</p>
          {/* Edit and delete buttons (conditionally rendered) */}
          {selectedChore && (
            <div className='expense-buttons'>
              <button onClick={() => {
                openEditPopup(selectedChore);
                setModalOpen(false); // Close the modal after opening the edit popup
              }}>Edit</button>
              <button onClick={() => {
                openDeletePopup(selectedChore);
                setModalOpen(false); // Close the modal after opening the delete popup
              }}>Delete</button>
            </div>
          )}
        </div>
      </Modal>


      <table className='expense-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Actions</th> {/* New column for edit and delete buttons */}
          </tr>
        </thead>
        <tbody>
          {chores.map((chore) => (
            <tr key={chore._id}>
              <td>{chore.title}</td>
              <td>{chore.assignedTo}</td>
              <td>{chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : ''}</td>
              <td className='expense-buttons'>
                {/* Edit button */}
                <button onClick={() => openEditPopup(chore)}>Edit</button>
                {/* Delete button */}
                <button onClick={() => openDeletePopup(chore)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCreateOpen && (
          <CreatePopup
            onClose={() => setCreateOpen(false)}
            onSubmit={handleSubmit}
          />
      )}
      {/* Pass selectedChore and handleEdit to the edit popup */}
      {isEditOpen && selectedChore && (
        <EditPopup
          chore={selectedChore}
          onClose={() => setEditOpen(false)}
          onEdit={handleEdit}
        />
      )}
      {/* Pass selectedChore and handleDelete to the delete popup */}
      {isDeleteOpen && selectedChore && (
        <DeletePopup
          choreId={selectedChore._id} // Pass the _id instead of the entire chore
          onClose={() => setDeleteOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ChoreMainPage;
