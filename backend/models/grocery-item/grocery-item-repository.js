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
export async function getGroceryItem(user_id, name) {
    const item = await GroceryItemModel.findOne({
        user_id: user_id,
        name: name
    })
    return item;
}

// UPDATE FUNCTION
export async function updateGroceryItem(params) {
    const item = await GroceryItemModel.findOne({ name: params.name });
    if (!item) {
        throw new Error('Database Error');
    }

    const updated = await GroceryItemModel.updateOne(
        { user_id: params.user_id, name: params.name },
        {
            $set: {
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
        user_id: params.user_id,
        name: params.name 
    });

    if (!item) {
        throw new Error('Database Error');
    }

    const deleted = await GroceryItemModel.deleteOne({ 
        user_id: params.user_id, 
        name: params.name 
    });
    return deleted.acknowledged;
}