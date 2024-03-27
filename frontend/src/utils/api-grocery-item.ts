import { GroceryItemResponse } from '../@types/GroceryItemContext';
import { URL_GROCERY_ITEM_SVC } from '../configs';
import { requests, API } from './api-request';

export const APIGroceryItem = {
    createItem: (body: {
        name: string,
        purchasedDate: Date,
        expiryDate: Date,
        quantity: number,
        unit: string,
        category: string
    }): Promise<API.Response<GroceryItemResponse>> =>
        requests.post(URL_GROCERY_ITEM_SVC, '', body),

    getItem: (name: string): Promise<
        API.Response<GroceryItemResponse>
    > => requests.get(URL_GROCERY_ITEM_SVC, `/${name}`),

    updateItem: (body: {
        name: string,
        purchasedDate: Date,
        expiryDate: Date,
        quantity: number,
        unit: string,
        category: string
    }): Promise<API.Response<GroceryItemResponse>> => {
        const headers = {
            'Content-Type': 'application/json',
        };
        return requests.put(URL_GROCERY_ITEM_SVC, `/${body.name}`, body);
    },

    deleteItem: (name: string): Promise<API.Response<GroceryItemResponse>> => {
        return requests.delete(URL_GROCERY_ITEM_SVC, `/${name}`, '');
    },
};

export default APIGroceryItem;
