import 'dotenv/config';
import NotificationModel from './notification-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_CLOUD_URI_TEST;

mongoose.connect(mongoDB);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));
if (process.env.ENV != 'PROD') {
  db.collections['notificationmodels']
    .drop()
    .then(() => console.log('Reset Notification DB'));
}

// CRD functions

export async function createNotificationModel(params) {
  return await NotificationModel.create(params);
}

export async function getNotificationModel(notificationId) {
  return await NotificationModel.findById(notificationId);
}

export async function getNotificationModelsByRecipient(recipient) {
  return await NotificationModel.find({ recipients: recipient });
}

export async function deleteNotificationForRecipient(
  notificationId,
  recipient
) {
  const updated = await NotificationModel.findByIdAndUpdate(
    notificationId,
    {
      $pull: { recipients: recipient },
    },
    { new: true }
  );

  if (updated.recipients.length == 0) {
    return deleteNotificationModel(notificationId);
  }
  return updated;
}

async function deleteNotificationModel(notificationId) {
  return await NotificationModel.deleteOne({ _id: notificationId });
}
