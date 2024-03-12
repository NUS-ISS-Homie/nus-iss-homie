export interface GroceryItem {
    user_id: string,
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