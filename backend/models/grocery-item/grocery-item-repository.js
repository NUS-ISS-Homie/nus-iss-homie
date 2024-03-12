import GroceryItemModel from "./grocery-item-model.js";
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
    return await GroceryItemModel.create({
        user_id: params.user_id,
        name: params.name,
        purchasedDate: params.purchasedDate,
        expiryDate: params.purchasedDate,
        category: params.category,
        quantity: params.quantity,
        unit: params.unit,
    });
}

// READ FUNCTION
export async function getGroceryItem(grocery_item_id) {
    const item = await GroceryItemModel.findOne({
        _id: grocery_item_id
    }).populate('user').exec();
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
                purchasedDate: params.purchasedDate,
                expiryDate: params.purchasedDate,
                category: params.category,
                quantity: params.quantity,
                unit: params.unit,
            }
        }
    );
    return updated;
}

// DELETE FUNCTION
export async function deleteGroceryItem(params) {
    const item = await GroceryItemModel.findOne({
        _id: grocery_item_id
    });

    if (!item) {
        throw new Error('Database Error');
    }

    const deleted = await GroceryItemModel.deleteOne({
        _id: grocery_item_id
    });
    return deleted.acknowledged;
}