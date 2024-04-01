import { GroceryListResponse } from '../@types/GroceryListContext';
import { URL_GROCERY_LIST_SVC } from '../configs';
import { requests, API } from './api-request';

export const APIGroceryList = {
  createList: (homeId: string): Promise<API.Response<GroceryListResponse>> =>
    requests.post(URL_GROCERY_LIST_SVC, '', { homeId }),

  getListByHomeId: (
    homeId: string
  ): Promise<API.Response<GroceryListResponse>> =>
    requests.get(URL_GROCERY_LIST_SVC, `/${homeId}`),

  addItemToList: (
    homeId: string,
    itemId: string
  ): Promise<API.Response<GroceryListResponse>> =>
    requests.put(URL_GROCERY_LIST_SVC, `/${homeId}/add`, { itemId }),

  removeItemFromList: (
    homeId: string,
    itemId: string
  ): Promise<API.Response<GroceryListResponse>> =>
    requests.put(URL_GROCERY_LIST_SVC, `/${homeId}/remove`, { itemId }),

  deleteList: (homeId: string): Promise<API.Response<GroceryListResponse>> => {
    return requests.delete(URL_GROCERY_LIST_SVC, '/', { homeId });
  },
};

export default APIGroceryList;
