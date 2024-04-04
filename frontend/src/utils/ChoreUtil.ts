import axios from 'axios';
import { URI_BACKEND } from '../configs';
import { Chore } from '../@types/ChoreType';
import { Notification } from '../@types/Notification';
import {
  NOTIFICATION_CHORE_SWAP_REQUEST_RESULT,
  STATUS_CREATED,
} from '../constants';
import APINotification from './api-notification';
import { useSnackbar } from '../context/SnackbarContext';

interface ChoreUtil {
  updateChores: (notification: Notification, swap: boolean) => Promise<void>;
}

export const useChoreUtil = (): ChoreUtil => {
  const snackbar = useSnackbar();

  const fetchChoresRequestedToSwap = async (
    notificationId: string
  ): Promise<Chore[]> => {
    try {
      const response = await axios.get(URI_BACKEND + '/api/chore');
      const allChores: Chore[] = response.data.chores;
      const choresRequestedToSwap = allChores.filter(
        (chore: Chore) => chore.requestSwapNotificationId === notificationId
      );
      return choresRequestedToSwap;
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
        let updatedFilteredChore = { ...chore, requestSwapNotificationId: '' };
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

      const notificationReceiverChore = updatedFilteredChores.find(
        (chore) => chore.assignedTo === sender
      );

      // Loop through the updated chores and update the database
      await Promise.all(
        updatedFilteredChores.map(async (chore) => {
          try {
            await axios.put(URI_BACKEND + `/api/chore/${chore._id}`, chore);
            console.log('Chore updated successfully:', chore);
          } catch (error) {
            console.error('Error updating chore:', error);
          }
        })
      );

      const dueDate = notificationReceiverChore?.dueDate;
      const formattedDueDate = dueDate
        ? new Date(dueDate).toLocaleDateString()
        : 'Unknown';
      const recipientId = [notification.sender._id];
      const senderId = notification.recipients[0]._id;

      const notificationMessage: string = swap
        ? `${recipient} has accepted your request to swap chores. Your new chore is ${notificationReceiverChore?.title} due on ${formattedDueDate}`
        : `${recipient} has declined your request to swap chores, ${notificationReceiverChore?.title} due on ${formattedDueDate}`;

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
