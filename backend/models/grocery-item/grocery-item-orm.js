import { networkInterfaces } from 'os';
import {
    createGroceryItem,
    getGroceryItem,
    updateGroceryItem,
    deleteGroceryItem
} from './grocery-item-repository.js';
import 'dotenv/config';

// CREATE FUNCTION
export async function ormCreateGroceryItem(user_id, name, purchasedDate, expiryDate, quantity, unit, category) {
    try {
        const newGroceryItem = await createGroceryItem({ user_id, name, purchasedDate, expiryDate, quantity, unit, category });
        await newGroceryItem.save();
        return true;
    } catch (err) {
        return { err };
    }
}

// READ FUNCTION
export async function ormGetGroceryItem(user_id, name) {
    try {
        const item = await getGroceryItem(user_id, name);
        return item;
    } catch (err) {
        console.log(
            `ERROR: Could not get grocery item from DB. Wrong name.`
        );
    };
    return { err };
}

// UPDATE FUNCTION
export async function ormUpdateGroceryItem(user_id, name, purchasedDate, expiryDate, quantity, unit, category) {
    try {
        const updatedGroceryItem = await updateGroceryItem({
            user_id,
            name,
            purchasedDate,
            expiryDate,
            quantity,
            unit,
            category
        });
        return updateGroceryItem;
    } catch (err) {
        return { err };
    }
}

// DELETE FUNCTION
export async function ormDeleteGroceryItem(user_id, name) {
    try {
        const isDeleted = await deleteGroceryItem({ user_id, name });
        return isDeleted;
    } catch (err) {
        return { err };
    }
}
