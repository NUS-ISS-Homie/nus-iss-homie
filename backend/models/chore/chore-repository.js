import ChoreModel from './chore-model.js';
import 'dotenv/config';
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_CLOUD_URI_TEST;

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// CREATE FUNCTION
export async function createChore(params) {
  try {
    const chore = await ChoreModel.create(params);
    return getChore(chore._id);
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function getChore(choreId) {
  try {
    return await ChoreModel.findById(choreId).populate({
      path: 'assignedTo',
      select: 'username',
    });
  } catch (err) {
    console.log(`ERROR: Could not get chore from DB.`);
    return { err };
  }
}

// READ FUNCTION
export async function getAllChoresInHome(params) {
  try {
    return await ChoreModel.find(params).populate({
      path: 'assignedTo',
      select: 'username',
    });
  } catch (err) {
    console.log(`ERROR: Could not get chores from DB.`);
    return { err };
  }
}

// READ FUNCTION
export async function getAllChoresDueToday() {
  try {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    return await ChoreModel.find({
      dueDate: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    }).populate({
      path: 'assignedTo',
      select: 'username',
    });
  } catch (err) {
    console.log(`ERROR: Could not get chores from DB.`);
    return { err };
  }
}

// UPDATE FUNCTION
export async function updateChore(choreId, updatedFields) {
  try {
    return await ChoreModel.findByIdAndUpdate(choreId, updatedFields, {
      new: true,
    }).populate({ path: 'assignedTo', select: 'username' });
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function deleteChore(choreId) {
  try {
    const deletedChore = await ChoreModel.findByIdAndDelete(choreId).populate({
      path: 'assignedTo',
      select: 'username',
    });
    return deletedChore;
  } catch (err) {
    return { err };
  }
}
