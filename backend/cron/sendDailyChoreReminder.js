import cron from 'node-cron';
import { ormGetChoresScheduledToday } from '../models/chore/chore-orm.js';
import { ormGetHome } from '../models/home/home-orm.js';
import { ormGetUser } from '../models/user/user-orm.js';
import { ormCreateNotification } from '../models/notification/notification-orm.js';

const NOTIFICATION_CHORE_REMINDER = '[CHORE REMINDER]';
// Define the cron job

export const cronJob = cron.schedule('00 00 * * *', async () => {
  try {
    const choresScheduledToday = await ormGetChoresScheduledToday();
    // Loop through the chores and send reminders
    choresScheduledToday.forEach(async (chore) => {
      const username = chore.assignedTo;
      const userId = await ormGetUser(username);
      const homeId = chore.home;
      const home = await ormGetHome(homeId);
      const notificationMessage = `You have a chore: ${chore.title}, scheduled today.`;
      // Send notification to the user
      await sendNotification(
        [userId._id],
        notificationMessage,
        home.adminUser._id
      );
    });
  } catch (error) {
    console.error('Error sending chore reminders:', error);
  }
});

// Function to send notification to a user
async function sendNotification(userId, message, adminId) {
  const notification = {
    sender: adminId,
    recipients: userId,
    message: { title: NOTIFICATION_CHORE_REMINDER, content: message },
  };
  try {
    ormCreateNotification(notification);
    // console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
