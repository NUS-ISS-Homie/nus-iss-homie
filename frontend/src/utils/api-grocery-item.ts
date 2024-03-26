import { GroceryItem, ItemResponse } from '../@types/GroceryItemContext';
import { URL_ITEM_SVC } from '../configs';
import { API, requests } from './api-request';

const APIGroceryItem = {
  createItem: (item: GroceryItem): Promise<API.Response<ItemResponse>> => {
    return requests.post(URL_ITEM_SVC, '', { item });
  },

  getItem: (itemId: string): Promise<API.Response<ItemResponse>> => {
    return requests.get(URL_ITEM_SVC, `/${itemId}`);
  },
};

export default APIGroceryItem;
