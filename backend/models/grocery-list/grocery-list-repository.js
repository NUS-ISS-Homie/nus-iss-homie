import GroceryListModel from './grocery-list-model.js';
import 'dotenv/config';

import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_CLOUD_URI_TEST;

mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// CREATE FUNCTION
export async function createGroceryList(params) {
  console.log('Received home id: ' + params.homeId);
  const list = await GroceryListModel.create({
    home: params.homeId,
  });
  return getGroceryList(list._id);
}

// READ FUNCTION
export async function getGroceryList(grocery_list_id) {
  const list = await GroceryListModel.findOne({
    _id: grocery_list_id,
  })
    .populate('home')
    .populate({
      path: 'items',
      populate: {
        path: 'user',
        select: 'username',
      },
    });
  return list;
}

export async function getGroceryListByHomeId(homeId) {
  const list = await GroceryListModel.findOne({
    home: homeId,
  })
    .populate('home')
    .populate({
      path: 'items',
      populate: {
        path: 'user',
        select: 'username',
      },
    });
  return list;
}

// UPDATE FUNCTION
export async function addGroceryItemToList(params) {
  let list = await GroceryListModel.findOne({ home: params.homeId });
  console.log('List found : ' + list);

  if (!list) {
    list = await createGroceryList(params);
    console.log('List created : ' + list);
  }

  return await GroceryListModel.findByIdAndUpdate(
    list._id,
    { $addToSet: { items: params.itemId } },
    { new: true }
  )
    .populate('home')
    .populate({
      path: 'items',
      populate: {
        path: 'user',
        select: 'username',
      },
    });
}

export async function deleteGroceryItemFromList(params) {
  const list = await GroceryListModel.findOne({ home: params.homeId });
  if (!list) {
    throw new Error('Database Error');
  }

  return await GroceryListModel.findByIdAndUpdate(
    list._id,
    { $pull: { items: params.itemId } },
    { new: true }
  )
    .populate('home')
    .populate({
      path: 'items',
      populate: {
        path: 'user',
        select: 'username',
      },
    });
}

// DELETE FUNCTION
// export async function deleteGroceryList(groceryListId) {
//     return await GroceryListModel.deleteOne({ _id: groceryListId });
// }
export async function deleteGroceryList(homeId) {
  return await GroceryListModel.deleteOne({ home: homeId });
}
