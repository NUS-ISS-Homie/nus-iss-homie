export interface User {
  username: string | null;
  user_id: string | null;
}

export interface UserContextInterface {
  user: User;
  login: (username: string, password: string) => {};
}
