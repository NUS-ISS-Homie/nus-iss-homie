import UserModel from './user-model.js';
import 'dotenv/config';

//Set up mongoose connection
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
export async function createUser(params) {
  return await UserModel.create({
    username: params.username,
    hashedPassword: params.hashedPassword,
  });
}

// READ FUNCTION
export async function getUser(username) {
  const user = await UserModel.findOne({ username: username });
  return user;
}

// UPDATE FUNCTION
export async function changePassword(params) {
  const user = await UserModel.findOne({ username: params.username });
  if (!user) {
    throw new Error('Database Error');
  }

  if (user.comparePassword(params.oldPassword)) {
    const updated = await UserModel.updateOne(
      { username: params.username },
      { $set: { hashedPassword: params.newHashedPassword } }
    );
    return updated;
  }
}

export async function changeUsername(params) {
  const user = await UserModel.findOne({ username: params.username });
  if (!user) {
    throw new Error('Database Error');
  }

  if (user.comparePassword(params.password)) {
    const updated = await UserModel.updateOne(
      { username: params.username },
      { $set: { username: params.newUsername } }
    );
    return updated;
  }
}

// DELETE FUNCTION
export async function deleteUser(params) {
  const user = await UserModel.findOne({ username: params.username });

  if (!user) {
    throw new Error('Database Error');
  }
  const deleted = await UserModel.deleteOne({ username: params.username });
  return deleted.acknowledged;
}
