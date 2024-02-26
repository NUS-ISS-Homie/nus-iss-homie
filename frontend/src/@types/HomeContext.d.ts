export interface Home {
  _id: string;
  users: string[];
}

export interface HomeModel {
  home: Home;
  message: string;
}
