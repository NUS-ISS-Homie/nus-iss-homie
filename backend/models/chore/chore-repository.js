import ChoreModel from './chore-model.js'; // Import Mongoose model for chore
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

//READ FUNCTION
export async function getAllChores() {
  try {
    return await ChoreModel.find();
  } catch (err) {
    console.log(`ERROR: Could not get chores from DB.`);
    return { err };
  }
}

// CREATE FUNCTION
export async function createChore(params) {
  try {
    console.log('Creating chore');
    return await ChoreModel.create({
      title: params.title,
      assignedTo: params.assignedTo,
      dueDate: params.dueDate,
    });
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function getChore(choreId) {
  try {
    return await ChoreModel.findById(choreId);
  } catch (err) {
    console.log(`ERROR: Could not get chore from DB.`);
    return { err };
  }
}

// UPDATE FUNCTION
export async function updateChore(choreId, updatedFields) {
  try {
    return await ChoreModel.findByIdAndUpdate(choreId, updatedFields, {
      new: true,
    });
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function deleteChore(choreId) {
  try {
    const deletedChore = await ChoreModel.findByIdAndDelete(choreId);
    return deletedChore ? true : false;
  } catch (err) {
    return { err };
  }
}
