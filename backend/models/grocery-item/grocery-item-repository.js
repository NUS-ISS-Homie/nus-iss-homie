import GroceryItemModel from './grocery-item-model.js';
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
export async function createGroceryItem(params) {
  const item = await GroceryItemModel.create({
    user: params.user_id,
    name: params.name,
    purchasedDate: new Date(params.purchasedDate),
    expiryDate: new Date(params.purchasedDate),
    category: params.category,
    quantity: params.quantity,
    unit: params.unit,
  });
  return getGroceryItem(item._id);
}

// READ FUNCTION
export async function getGroceryItem(grocery_item_id) {
  const item = await GroceryItemModel.findOne({
    _id: grocery_item_id,
  }).populate({ path: 'user', select: 'username' });
  console.log(item);
  return item;
}

// UPDATE FUNCTION
export async function updateGroceryItem(params) {
  const item = await GroceryItemModel.findOne({ _id: params.grocery_item_id });
  if (!item) {
    throw new Error('Database Error');
  }

  const updated = await GroceryItemModel.updateOne(
    { _id: params.grocery_item_id },
    {
      $set: {
        name: params.name,
        purchasedDate: new Date(params.purchasedDate),
        expiryDate: new Date(params.expiryDate),
        category: params.category,
        quantity: params.quantity,
        unit: params.unit,
      },
    }
  ).populate({ path: 'user', select: 'username' });
  return updated;
}

// DELETE FUNCTION
export async function deleteGroceryItem(params) {
  const item = await GroceryItemModel.findOne({
    _id: params.grocery_item_id,
  });
  if (!item) {
    throw new Error('Database Error');
  }

  const deleted = await GroceryItemModel.deleteOne({
    _id: params.grocery_item_id,
  }).populate({ path: 'user', select: 'username' });

  return deleted.acknowledged;
}
