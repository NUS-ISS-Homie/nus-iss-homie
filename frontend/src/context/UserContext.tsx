import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../@types/UserContext';
import * as authClient from '../utils/auth-client';
import { LOCAL_STORAGE_USER_KEY } from '../configs';
import { STATUS_OK } from '../constants';
import { useSnackbar } from './SnackbarContext';

export const defaultUser: User = {
  username: null,
  user_id: null,
};

export const getUserFromLocalStorage = () => {
  const userStr = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  return userStr && JSON.parse(userStr);
};

export const removeUser = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
};

export const saveUserToLocalStorage = (user: User) => {
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
};

const UserContext = createContext({
  user: defaultUser,
  setUser: (user: User) => {},
  logout: () => {},
  deleteUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: '', user_id: '' });
  const [loading, setLoading] = useState(false);

  const snackbar = useSnackbar();

  const logout = () => {
    setLoading(true);
    setUser({ username: '', user_id: '' });
    removeUser();
    setLoading(false);
  };

  const deleteUser = () => {
    if (!user.username) return;
    setLoading(true);
    authClient.AuthClient.deleteUser({ username: user.username })
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

  useEffect(() => {
    const user = getUserFromLocalStorage();
    user && setUser(user);
  }, []);

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
