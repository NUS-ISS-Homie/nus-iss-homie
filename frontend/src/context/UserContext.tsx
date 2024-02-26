import React, { createContext, useState, useContext } from 'react';
import { User } from '../@types/UserContext';
import * as authClient from '../utils/auth-client';
import { LOCAL_STORAGE_USERNAME_KEY } from '../configs';
import { STATUS_OK, STATUS_BAD_REQUEST } from '../constants';
import { useSnackbar } from './SnackbarContext';

export const defaultUser: User = {
  username: null,
  user_id: null,
};

export const getUsername = () => {
  const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  return { username: username || '' };
};

export const removeUser = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
};

const UserContext = createContext({
  user: defaultUser,
  setUser: (user: User) => {},
  logout: () => {},
  deleteUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: '', user_id: '' });
  const [loading, setLoading] = useState(true);

  const snackbar = useSnackbar();

  const logout = () => {
    setLoading(true);
    const { username } = getUsername();
    authClient.AuthClient.logout({ username })
      .then((resp) => {
        if (resp.status === STATUS_BAD_REQUEST)
          throw new Error('Username or password is missing!');

        setUser({ username: '', user_id: '' });
        removeUser();
      })
      .catch((err) => {
        snackbar.setError(err.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteUser = () => {
    setLoading(true);
    const { username } = getUsername();
    authClient.AuthClient.deleteUser({ username })
      .then((resp) => {
        if (resp.status !== STATUS_OK)
          throw new Error('Something went wrong when deleting the account!');

        removeUser();
        setUser({ username: '', user_id: '' });
        snackbar.setSuccess('Account deleted');
      })
      .catch((err) => {
        snackbar.setError(err.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useAuth = () => useContext(UserContext);
const useUser = () => useAuth().user;

export { useAuth, useUser };
