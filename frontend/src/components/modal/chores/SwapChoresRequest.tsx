import { Chore } from '../../../@types/Chore';
import { Notification } from '../../../@types/Notification';
import {
  NOTIFICATION_CHORE_SWAP_REQUEST_RESULT,
  STATUS_CREATED,
  STATUS_OK,
} from '../../../constants';
import APINotification from '../../../utils/api-notification';
import { useSnackbar } from '../../../context/SnackbarContext';
import APIChore from '../../../utils/api-chore';

interface SwapChoresRequest {
  updateChores: (notification: Notification, swap: boolean) => Promise<void>;
}

export const useSwapChoresRequest = (): SwapChoresRequest => {
  const snackbar = useSnackbar();

  const fetchChoresRequestedToSwap = async (
    notificationId: string
  ): Promise<Chore[]> => {
    try {
      const {
        data: { chores, message },
        status,
      } = await APIChore.getChoresByNotificationId(notificationId);
      if (status !== STATUS_OK) {
        throw new Error(message);
      }
      return chores;
    } catch (error) {
      console.error('Error fetching chores:', error);
      throw error;
    }
  };

  const updateChores = async (
    notification: Notification,
    swap: boolean
  ): Promise<void> => {
    try {
      const notificationId = notification._id;
      const sender = notification.sender.username;
      const recipient = notification.recipients[0].username;

      const choresRequestedToSwap =
        await fetchChoresRequestedToSwap(notificationId);
      const updatedFilteredChores = choresRequestedToSwap.map((chore) => {
        let updatedFilteredChore = {
          ...chore,
          requestSwapNotificationId: null,
        };
        if (swap && chore.assignedTo === sender) {
          updatedFilteredChore = {
            ...updatedFilteredChore,
            assignedTo: recipient,
          };
        } else if (swap && chore.assignedTo === recipient) {
          updatedFilteredChore = {
            ...updatedFilteredChore,
            assignedTo: sender,
          };
        }
        return updatedFilteredChore;
      });

      await Promise.all(
        updatedFilteredChores.map(async (updatedFilteredChore) => {
          try {
            const {
              data: { message },
              status,
            } = await APIChore.updateChore(updatedFilteredChore);
            if (status !== STATUS_OK) {
              throw new Error(message);
            }
          } catch (error) {
            console.error('Error updating chore:', error);
            throw error;
          }
        })
      );

      const notificationReceiverChore = updatedFilteredChores.find(
        (chore) => chore.assignedTo === sender
      );

      const scheduledDate = notificationReceiverChore?.scheduledDate;
      const formattedScheduleDate = scheduledDate
        ? new Date(scheduledDate).toLocaleDateString()
        : 'Unknown';
      const recipientId = [notification.sender._id];
      const senderId = notification.recipients[0]._id;

      const notificationMessage: string = swap
        ? `${recipient} has accepted your request to swap chores. Your new chore is ${notificationReceiverChore?.title} scheduled for ${formattedScheduleDate}`
        : `${recipient} has declined your request to swap chores, ${notificationReceiverChore?.title} scheduled for ${formattedScheduleDate}`;

      const notificationForChoreSwapRequest = {
        sender: senderId || '',
        recipients: recipientId,
        message: {
          title: NOTIFICATION_CHORE_SWAP_REQUEST_RESULT,
          content: notificationMessage,
        },
      };

      try {
        const response = await APINotification.createNotification(
          notificationForChoreSwapRequest
        );
        if (response.status === STATUS_CREATED) {
          snackbar.setSuccess('Notification sent successfully.');
        } else {
          snackbar.setError('Failed to send notification.');
        }
      } catch (error) {
        snackbar.setError('Error sending notification.');
        console.error('Error sending notification:', error);
      }
    } catch (error) {
      console.error('Error updating chores:', error);
    }
  };

  return { updateChores };
};
