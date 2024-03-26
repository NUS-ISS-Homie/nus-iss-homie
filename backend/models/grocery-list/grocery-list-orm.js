import { 
    addGroceryItemToList, 
    createGroceryList, 
    deleteGroceryItemFromList, 
    deleteGroceryList, 
    getGroceryList, 
    getGroceryListByHomeId 
} from './grocery-list-repository.js';
  
  export async function ormCreateGroceryList(homeId) {
    try {
      const newList = await createGroceryList({
        homeId: homeId,
        items: [],
      });
      await newList.save();
      return newList;
    } catch (err) {
      return { error: true, message: err };
    }
  }
  
  export async function ormGetGroceryList(groceryListId) {
    try {
      const list = await getGroceryList(groceryListId);
      return list;
    } catch (err) {
      return { error: true, message: err };
    }
  }
  
  export async function ormGetGroceryListByHomeId(homeId) {
    try {
      const list = await getGroceryListByHomeId(homeId);
      return list;
    } catch (err) {
      return { error: true, message: err };
    }
  }
  
  export async function ormAddToList(homeId, itemId) {
    try {
      const updatedList = await addGroceryItemToList({
        homeId,
        itemId,
      });
      return updatedList;
    } catch (err) {
      return { error: true, message: err };
    }
  }
  
  export async function ormDeleteFromList(homeId, itemId) {
    try {
      const updatedList = await deleteGroceryItemFromList({
        homeId,
        itemId,
      });
      return updatedList;
    } catch (err) {
      return { error: true, message: err };
    }
  }
  
  export async function ormDeleteList(homeId) {
    try {
      await deleteGroceryList(homeId);
      return {
        error: false,
        message: 'Grocery List deletion successful!',
      };
    } catch (err) {
      return { error: true, message: err };
    }
  }
  