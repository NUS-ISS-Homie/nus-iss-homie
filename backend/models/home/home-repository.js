import 'dotenv/config';
import HomeModel from './home-model.js';

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
  db.collections['homemodels'].drop().then(() => console.log('Reset Home DB'));
}

// CRUD functions

export async function createHomeModel(params) {
  return await HomeModel.create(params);
}

export async function getHomeModel(homeId) {
  return await HomeModel.findById(homeId)
    .populate({ path: 'adminUser', select: 'username' })
    .populate({ path: 'users', select: 'username' });
}

export async function getHomeModelByUserId(userId) {
  return await HomeModel.findOne({
    $or: [{ adminUser: userId }, { users: userId }],
  })
    .populate({ path: 'adminUser', select: 'username' })
    .populate({ path: 'users', select: 'username' });
}

export const updateOperation = {
  Join: 'Join',
  Remove: 'Remove User',
};

export async function updateHomeModel(params) {
  switch (params.operation) {
    case updateOperation.Join:
      return await HomeModel.findByIdAndUpdate(
        params.homeId,
        { $addToSet: { users: params.userId } },
        { new: true }
      )
        .populate({ path: 'adminUser', select: 'username' })
        .populate({ path: 'users', select: 'username' });
    case updateOperation.Remove:
      return await HomeModel.findByIdAndUpdate(
        params.homeId,
        { $pull: { users: params.userId } },
        { new: true }
      )
        .populate({ path: 'adminUser', select: 'username' })
        .populate({ path: 'users', select: 'username' });
    default:
      throw new Error('Invalid update operation');
  }
}

export async function deleteHomeModel(homeId) {
  return await HomeModel.deleteOne({ _id: homeId });
}
