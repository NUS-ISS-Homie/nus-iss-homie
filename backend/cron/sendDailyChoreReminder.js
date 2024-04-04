import axios from 'axios';
import cron from 'node-cron';
import { getChores } from '../controllers/chore-controller';

const URI_BACKEND = 'http://localhost:8000';
const PREFIX_NOTIF_SVC = '/api/notification';
const URL_NOTIF_SVC = URI_BACKEND + PREFIX_NOTIF_SVC;
const NOTIFICATION_CHORE_REMINDER = '[CHORE REMINDER]';
// Define the cron job

export const cronJob = cron.schedule('0 0 * * *', async () => {
  try {
    const choresDueToday = await getChores();
    // Loop through the chores and send reminders
    choresDueToday.forEach(async (chore) => {
      const userId = chore.assignedTo._id;
      const home = chore.home;
      const notificationMessage = `You have a chore: ${chore.title}, due today.`;
      // Send notification to the user
      await sendNotification(userId, notificationMessage, home.adminUser._id);
    });
  } catch (error) {
    console.error('Error sending chore reminders:', error);
  }
});

// Function to send notification to a user
async function sendNotification(userId, message, admin_id) {
  const notification = {
    sender: admin_id.toString(),
    recipients: userId.toString(),
    message: { title: NOTIFICATION_CHORE_REMINDER, content: message },
  };
  try {
    const response = await axios.post(URL_NOTIF_SVC, notification);
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
