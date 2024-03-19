import GroceryListModel from "./grocery-list-model.js";
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
    const list = await GroceryListModel.create({
        home: params.homeId
    });
    return getGroceryList(list._id);
}

// READ FUNCTION
export async function getGroceryList(grocery_list_id) {
    const list = await GroceryListModel.findOne({
        _id: grocery_list_id
    })
    .populate('home')
    .populate('items')
    .exec();
    return list;
}

export async function getGroceryListByHomeId(home_id) {
    const list = await GroceryListModel.findOne({
        home: home_id
    })
    .populate('home')
    .populate('items')
    .exec();
    return list;
}

// UPDATE FUNCTION
export async function addGroceryItemToList(params) {
    const list = await GroceryListModel.findOne({ home: params.homeId });
    if (!list) {
        throw new Error('Database Error');
    }

    return await GroceryListModel.findByIdAndUpdate(
        list._id,
        { $addToSet: { items: params.itemId } },
        { new: true }
      )
      .populate('home')
      .populate('items')
      .exec();
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
      .populate('items')
      .exec();
}

// DELETE FUNCTION
// export async function deleteGroceryList(groceryListId) {
//     return await GroceryListModel.deleteOne({ _id: groceryListId });
// }
export async function deleteGroceryList(homeId) {
    return await GroceryListModel.deleteOne({ home: homeId });
}