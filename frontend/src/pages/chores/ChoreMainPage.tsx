import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePopup from '../../components/modal/chores/ChoresAddPopUp';
import EditPopup from '../../components/modal/chores/ChoresEditPopUp';
import DeletePopup from '../../components/modal/chores/ChoresDeletePopUp';
import '../../CSS/ExpenseMainPage.css'; // Import the CSS file
import { URI_BACKEND } from '../../configs';
import { Chore } from '../../@types/ChoreType';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ChoreViewDetail from '../../components/modal/chores/ChoresViewDetailPopUp';
import { useHome } from '../../context/HomeContext';
import { useSnackbar } from '../../context/SnackbarContext';
import APINotification from '../../utils/api-notification';
import { NOTIFICATION_NEW_CHORE, STATUS_CREATED } from '../../constants';
import { AuthClient } from '../../utils/auth-client';
import { useUser } from '../../context/UserContext';

function ChoreMainPage() {
  // State variables for managing chores and pop-up visibility
  const [chores, setChores] = useState<Chore[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [refreshChoreList, setRefreshChoreList] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const home = useHome();
  const snackbar = useSnackbar();
  const { user_id } = useUser();

  // Function to fetch chores from the backend API

  useEffect(() => {
    if (!home) return;
    axios
      .get(URI_BACKEND + '/api/chore')
      .then((response) => {
        const allChores = response.data.chores;
        // Filter chores based on usernames in the home
        const filteredChores = allChores.filter((chore: Chore) =>
          home.users.some((user) => user.username === chore.assignedTo)
        );
        setChores(filteredChores);
      })
      .catch((error) => {
        console.error('Error fetching chores:', error);
      });
  }, [refreshChoreList]);

  const handleSendNotification = async (
    recipientIds: string[],
    notificationMessage: string
  ) => {
    if (!home) return;
    const notification = {
      sender: user_id || '', // Provide the sender ID
      recipients: recipientIds, // Provide the recipient user IDs as an array
      message: {
        title: NOTIFICATION_NEW_CHORE,
        content: notificationMessage,
      },
    };

    try {
      const response = await APINotification.createNotification(notification);
      if (response.status === STATUS_CREATED) {
        snackbar.setSuccess('Notification sent successfully.');
      } else {
        snackbar.setError('Failed to send notification.');
      }
    } catch (error) {
      snackbar.setError('Error sending notification.');
      console.error('Error sending notification:', error);
    }
  };

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
  const handleSubmit = async (formData: any) => {
    const assigned = formData.assignedTo;
    const choreTitle = formData.title;
    const dueDate = new Date(formData.dueDate).toLocaleDateString();
    try {
      const response = await axios.post(
        URI_BACKEND + '/api/chore/create',
        formData
      );
      setChores([...chores, response.data]);
      setRefreshChoreList((refreshChoreList: any) => !refreshChoreList);

      // Get the user ID synchronously
      const userId = (await AuthClient.getUserId(assigned)).data.user_id;
      const notificationMessage = `You have been assigned a new chore: ${choreTitle}, due on ${dueDate}.`;
      // Pass the user ID as an array to handleSendNotification
      handleSendNotification([userId], notificationMessage);
    } catch (error) {
      console.error('Error creating chore:', error);
    }
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
    const eventId = info.event.id;
    const selectedChore = chores.find((chore) => chore._id === eventId);
    setSelectedChore(selectedChore || null);
    setIsViewDetailsOpen(true);
  };

  return (
    <div>
      <h1>Chore Tracker</h1>
      <div className='expense-buttons add-expense-container'>
        <button onClick={openCreatePopup}>Add Chore</button>
      </div>
      <FullCalendar
        contentHeight='auto'
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridWeek'
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
        eventMouseEnter={(info) => {
          info.el.style.cursor = 'pointer';
        }}
        eventMouseLeave={(info) => {
          info.el.style.cursor = '';
        }}
      />
      {isViewDetailsOpen && (
        <ChoreViewDetail
          selectedChore={selectedChore}
          openEditPopup={openEditPopup}
          setIsViewDetailsOpen={setIsViewDetailsOpen}
          openDeletePopup={openDeletePopup}
        />
      )}
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
