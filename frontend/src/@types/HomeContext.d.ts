interface User {
  _id: string;
  username: string;
}

export interface Home {
  _id: string;
  users: User[];
  adminUser: User;
}

export interface HomeResponse {
  home: Home;
  message: string;
}
