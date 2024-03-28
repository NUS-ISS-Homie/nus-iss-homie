import { GroceryItem } from './GroceryItemContext';
import { Home } from './HomeContext';
import { User } from './UserContext';

export interface GroceryList {
  _id: string;
  home: Home;
  items: GroceryItem[];
}

export interface GroceryListResponse {
  list: GroceryList;
  message: string;
  status: number;
}
