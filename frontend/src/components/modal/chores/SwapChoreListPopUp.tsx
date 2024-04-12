import { Chore } from '../../../@types/Chore';
import {
  NOTIFICATION_CHORE_SWAP_REQUEST,
  STATUS_CREATED,
  STATUS_OK,
} from '../../../constants';
import APINotification from '../../../utils/api-notification';
import { AuthClient } from '../../../utils/auth-client';
import { useEffect, useState } from 'react';
import APIChore from '../../../utils/api-chore';
import { homeSocketEvents as events } from '../../../constants';

interface swapChoreListProps {
  selectedChore: Chore;
  chores: Chore[];
  setIsSwapChoreListOpen: any;
  currentDate: any;
  home: any;
  user_id: any;
  snackbar: any;
  username: any;
  setChores: any;
  homeSocket: any;
  updateChores: () => void;
}

const SwapChoreList: React.FC<swapChoreListProps> = ({
  selectedChore,
  chores,
  setIsSwapChoreListOpen,
  currentDate,
  home,
  user_id,
  snackbar,
  username,
  homeSocket,
  updateChores,
}) => {
  const [message, setMessage] = useState('');
  const [notificationId, setNotificationId] = useState('');

  useEffect(() => {
    const requestedSwap = selectedChore.requestSwapNotificationId;
    if (requestedSwap) {
      setNotificationId(requestedSwap);
      APINotification.getNotification(requestedSwap)
        .then((notification) => {
          const constructedMessage =
            notification.data.notification.sender._id === user_id
              ? `${notification.data.notification.recipients[0].username} has not responded to your swap request for this chore.`
              : `${notification.data.notification.sender.username} has requested to swap for this chore with you. More information can be found in the notification panel.`;
          setMessage(constructedMessage);
        })
        .catch((error) => {
          console.error('Error fetching notification:', error);
        });
    }
  }, [user_id, selectedChore]);

  const handleSendNotification = async (chore: Chore) => {
    const recipientId = [
      (await AuthClient.getUserId(chore.assignedTo)).data.user_id,
    ];
    const notificationMessage = `${username} has requested to swap chores with you. Do you wish to swap your chore, ${chore.title} scheduled for ${new Date(chore.scheduledDate).toLocaleDateString()}, with ${selectedChore.title} scheduled for ${new Date(selectedChore.scheduledDate).toLocaleDateString()}?`;
    if (!home) return;
    const notification = {
      sender: user_id || '', // Provide the sender ID
      recipients: recipientId, // Provide the recipient user IDs as an array
      message: {
        title: NOTIFICATION_CHORE_SWAP_REQUEST,
        content: notificationMessage,
      },
    };

    try {
      const response = await APINotification.createNotification(notification);
      if (response.status === STATUS_CREATED) {
        const notificationId = response.data.notification._id.toString();
        updateRequestedSwapField(chore, notificationId);
        snackbar.setSuccess('Notification sent successfully.');
      } else {
        snackbar.setError('Failed to send notification.');
      }
    } catch (error) {
      snackbar.setError('Error sending notification.');
      console.error('Error sending notification:', error);
    }
  };
  const updateRequestedSwapField = async (
    chore: Chore,
    notificationId: string
  ) => {
    APIChore.updateChore({
      ...chore,
      requestSwapNotificationId: notificationId,
    })
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        homeSocket.emit(events.UPDATE_CHORES, home?._id);
        updateChores();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message));

    // Update the requestedSwap field for the selectedChore
    APIChore.updateChore({
      ...selectedChore,
      requestSwapNotificationId: notificationId,
    })
      .then(({ data: { chore, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        homeSocket.emit(events.UPDATE_CHORES, home?._id);
        updateChores();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message));
  };

  const filteredChores = chores.filter(
    (chore) =>
      chore.assignedTo !== selectedChore.assignedTo &&
      new Date(chore.scheduledDate) >= currentDate &&
      chore.requestSwapNotificationId === null
  );

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
          onClick={() => setIsSwapChoreListOpen(false)}
        >
          x
        </button>
        {!notificationId && (
          <table className='expense-table'>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Chore</th>
                <th style={{ whiteSpace: 'nowrap' }}>Assigned To</th>
                <th style={{ whiteSpace: 'nowrap' }}>Scheduled Date</th>
                <th style={{ whiteSpace: 'nowrap' }}>Request Swap</th>
              </tr>
            </thead>
            <tbody>
              {filteredChores
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((chore) => (
                  <tr key={chore._id}>
                    <td>{chore.title}</td>
                    <td>{chore.assignedTo}</td>
                    <td>
                      {new Date(chore.scheduledDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div className='expense-buttons'>
                        <button
                          onClick={() => {
                            setIsSwapChoreListOpen(false);
                            handleSendNotification(chore);
                          }}
                        >
                          Swap
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {notificationId && (
          <>
            <h2>Chore Swap Requested</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
};
export default SwapChoreList;
