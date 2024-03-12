export interface Home {
  _id: string | null;
  users: string[];
  adminUser: string | null;
}

export interface HomeResponse {
  home: Home;
  message: string;
}
