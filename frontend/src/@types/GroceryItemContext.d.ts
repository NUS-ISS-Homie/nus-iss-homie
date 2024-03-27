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