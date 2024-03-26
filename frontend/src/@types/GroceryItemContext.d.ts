import { User } from './UserContext';

export interface GroceryItem {
  _id: string;
  user: User;
  name: string;
  purchasedDate: Date;
  expiryDate: Date;
  quantity: number;
  unit: string;
  category: string;
}

export interface ItemResponse {
  item: GroceryItem;
  message: string;
}
