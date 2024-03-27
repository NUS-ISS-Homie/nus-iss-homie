import { User } from "./UserContext"

export interface GroceryItem {
    _id: string,
    user: User,
    name: string,
    purchasedDate: Date,
    expiryDate: Date,
    quantity: number,
    unit: string,
    category: string
}

export interface GroceryItemResponse {
    item: GroceryItem,
    message: string,
    status: number
}

export const Unit: string[] = ['pc', 'kg', 'lb', 'L'];

export const Category: string[] = [
    'Meat',
    'Seafood',
    'Vegetable',
    'Fruit',
    'Snack',
    'Dairy/Egg',
    'Frozen',
    'Condiment/Seasoning',
    'Fermented',
    'Beverage'
]
