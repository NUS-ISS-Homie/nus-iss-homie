import { useState, useEffect, useCallback } from 'react';
import CreatePopup from '../../components/modal/chores/ChoresAddPopUp';
import EditPopup from '../../components/modal/chores/ChoresEditPopUp';
import DeletePopup from '../../components/modal/chores/ChoresDeletePopUp';
import '../../CSS/ExpenseMainPage.css'; // Import the CSS file
import { Chore, NewChore } from '../../@types/Chore';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ChoreViewDetail from '../../components/modal/chores/ChoresViewDetailPopUp';
import { useHome } from '../../context/HomeContext';
import { useSnackbar } from '../../context/SnackbarContext';
import APINotification from '../../utils/api-notification';
import {
  NOTIFICATION_NEW_CHORE,
  NOTIFICATION_EDITED_CHORE,
  STATUS_CREATED,
  STATUS_OK,
} from '../../constants';
import { AuthClient } from '../../utils/auth-client';
import { useUser } from '../../context/UserContext';
import SwapChoreList from '../../components/modal/chores/SwapChoreListPopUp';
import APIChore from '../../utils/api-chore';
import { homeSocketEvents as events } from '../../constants';

import { useSockets } from '../../context/SocketContext';

function ChoreMainPage() {
  // State variables for managing chores and pop-up visibility
  const [chores, setChores] = useState<Chore[]>([]);
  const [selectedChore, setSelectedChore] = useState<Chore>();
  const [houseMembers, setHouseMembers] = useState<string[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isSwapChoreListOpen, setIsSwapChoreListOpen] = useState(false);

  const home = useHome();
  const snackbar = useSnackbar();
  const { user_id, username } = useUser();
  const { homeSocket } = useSockets();

  const isAdmin = home?.adminUser?._id === user_id && user_id !== null;
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const updateChores = useCallback(() => {
    if (!home) return;
    APIChore.getChoresByHomeId(home._id)
      .then(({ data: { chores, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        setChores(chores);
      })
      .catch((err) => snackbar.setError(err.message));
  }, [home, snackbar]);

  useEffect(updateChores, [updateChores]);

  useEffect(() => {
    homeSocket.on(events.UPDATE_CHORES, updateChores);
    return () => {
      homeSocket.off(events.UPDATE_CHORES, updateChores);
    };
  }, [homeSocket, updateChores]);

  useEffect(() => {
    if (!home) return;
    const usernames = home.users.map(({ username }) => username);
    setHouseMembers(usernames);
  }, [home]);

  const handleSendNotification = async (
    recipientIds: string[],
    notificationMessage: string,
    messageTitle: string
  ) => {
    console.log(recipientIds);
    console.log(notificationMessage);
    console.log(messageTitle);
    if (!home) return;
    const notification = {
      sender: user_id || '', // Provide the sender ID
      recipients: recipientIds, // Provide the recipient user IDs as an array
      message: {
        title: messageTitle,
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
  const handleSubmit = async (formData: NewChore) => {
    const assigned = formData.assignedTo;
    const choreTitle = formData.title;
    const scheduledDate = new Date(formData.scheduledDate).toLocaleDateString();
    const userId = (await AuthClient.getUserId(assigned)).data.user_id;
    const notificationMessage = `You have been assigned a new chore: ${choreTitle}, scheduled for ${scheduledDate}.`;
    const messageTitle = NOTIFICATION_NEW_CHORE;
    APIChore.createChore(formData)
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        homeSocket.emit(events.UPDATE_CHORES, home?._id);
        updateChores();
        snackbar.setSuccess(message);
      })
      .catch((err) => console.log(err.message));
    handleSendNotification([userId], notificationMessage, messageTitle);
  };

  // Function to handle editing a chore
  const handleEdit = async (editedChore: Chore) => {
    const assigned = editedChore.assignedTo;
    const choreTitle = editedChore.title;
    const scheduledDate = new Date(
      editedChore.scheduledDate
    ).toLocaleDateString();
    const userId = (await AuthClient.getUserId(assigned)).data.user_id;
    const sameAssignedTo = selectedChore?.assignedTo === assigned;
    const notificationMessage = sameAssignedTo
      ? `The chore assigned to you has been updated: ${choreTitle}, scheduled for ${scheduledDate}.`
      : `You have been assigned a new chore: ${choreTitle}, scheduled for ${scheduledDate}.`;
    const messageTitle = sameAssignedTo
      ? NOTIFICATION_EDITED_CHORE
      : NOTIFICATION_NEW_CHORE;
    APIChore.updateChore(editedChore)
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        homeSocket.emit(events.UPDATE_CHORES, home?._id);
        updateChores();
        snackbar.setSuccess(message);
        handleSendNotification([userId], notificationMessage, messageTitle);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  // Function to handle deleting a chore
  const handleDelete = () => {
    if (!selectedChore) return;
    APIChore.deleteChore(selectedChore._id)
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        homeSocket.emit(events.UPDATE_CHORES, home?._id);
        updateChores();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  const handleEventClick = (info: any) => {
    if (!info.event.id) return;
    APIChore.getChore(info.event.id)
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        setSelectedChore(chore);
        setIsViewDetailsOpen(true);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  return (
    <div>
      <h1>Chore Tracker</h1>
      <div className='expense-buttons add-expense-container'>
        {isAdmin && <button onClick={openCreatePopup}>Add Chore</button>}
      </div>
      <FullCalendar
        contentHeight='auto'
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridWeek'
        events={chores.map((chore) => ({
          id: String(chore._id),
          title: chore.title,
          start: chore.scheduledDate, // Assuming chore.scheduledDate is in ISO format
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
          setIsSwapChoreListOpen={setIsSwapChoreListOpen}
          username={username}
          currentDate={currentDate}
          isAdmin={isAdmin}
        />
      )}
      {isCreateOpen && (
        <CreatePopup
          onClose={() => setCreateOpen(false)}
          onSubmit={handleSubmit}
          houseMembers={houseMembers}
          home={home}
          today={today}
        />
      )}
      {/* Pass selectedChore and handleEdit to the edit popup */}
      {isEditOpen && selectedChore && (
        <EditPopup
          isAdmin={isAdmin}
          user_id={user_id}
          home={home}
          chore={selectedChore}
          houseMembers={houseMembers}
          onClose={() => setEditOpen(false)}
          onEdit={handleEdit}
          today={today}
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
      {isSwapChoreListOpen && selectedChore && (
        <SwapChoreList
          selectedChore={selectedChore}
          chores={chores}
          setIsSwapChoreListOpen={setIsSwapChoreListOpen}
          currentDate={currentDate}
          home={home}
          user_id={user_id}
          snackbar={snackbar}
          username={username}
          setChores={setChores}
          homeSocket={homeSocket}
          updateChores={updateChores}
        />
      )}
    </div>
  );
}

export default ChoreMainPage;
