import { GroceryItem } from "./GroceryItemContext"
import { User } from "./UserContext"

export interface GroceryList {
    _id: string,
    home: string,
    items: GroceryItem[]
}

export interface GroceryListResponse {
    list: GroceryList,
    message: string,
    status: number
}