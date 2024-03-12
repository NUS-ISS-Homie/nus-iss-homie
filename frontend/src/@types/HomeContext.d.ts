import { User } from './UserContext';

export interface Home {
  _id: string | null;
  users: User[];
  adminUser: User | null;
}

export interface HomeResponse {
  home: Home;
  message: string;
}
