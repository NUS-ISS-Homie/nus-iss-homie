import { networkInterfaces } from 'os';
import {
  createGroceryItem,
  getGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
} from './grocery-item-repository.js';
import 'dotenv/config';

// CREATE FUNCTION
export async function ormCreateGroceryItem(
  user_id,
  name,
  purchasedDate,
  expiryDate,
  quantity,
  unit,
  category
) {
  try {
    const newGroceryItem = await createGroceryItem({
      user_id,
      name,
      purchasedDate,
      expiryDate,
      quantity,
      unit,
      category,
    });
    await newGroceryItem.save();
    return newGroceryItem;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetGroceryItem(grocery_item_id) {
  try {
    const item = await getGroceryItem(grocery_item_id);
    return item;
  } catch (err) {
    console.log(`ERROR: Could not get grocery item from DB.`);
  }
  return { err };
}

// UPDATE FUNCTION
export async function ormUpdateGroceryItem(
  grocery_item_id,
  user_id,
  name,
  purchasedDate,
  expiryDate,
  quantity,
  unit,
  category
) {
  try {
    const updatedGroceryItem = await updateGroceryItem({
      grocery_item_id,
      user_id,
      name,
      purchasedDate,
      expiryDate,
      quantity,
      unit,
      category,
    });
    return updatedGroceryItem;
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function ormDeleteGroceryItem(grocery_item_id) {
  try {
    const isDeleted = await deleteGroceryItem({ grocery_item_id });
    return isDeleted;
  } catch (err) {
    return { err };
  }
}
