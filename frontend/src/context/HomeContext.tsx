import React, { createContext, useState, useContext, useEffect } from 'react';
import { Home } from '../@types/HomeContext';
import { LOCAL_STORAGE_HOME_KEY } from '../configs';
import { STATUS_OK, STATUS_BAD_REQUEST } from '../constants';
import { useSnackbar } from './SnackbarContext';
import APIHome from '../utils/api-home';

export const defaultHome: Home = {
  _id: null,
  users: [],
  adminUser: null,
};

const getHome = () => {
  const homeStr = window.localStorage.getItem(LOCAL_STORAGE_HOME_KEY);
  return homeStr ? JSON.parse(homeStr) : null;
};

export const removeHomeFromStorage = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_HOME_KEY);
};

export const saveHomeInStorage = (home: Home) => {
  window.localStorage.setItem(LOCAL_STORAGE_HOME_KEY, JSON.stringify(home));
};

const HomeContext = createContext({
  home: defaultHome,
  setHome: (home: Home) => {},
  logout: () => {},
  deleteHome: () => {},
});

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [home, setHome] = useState<Home>(defaultHome);
  const [loading, setLoading] = useState(false);

  const snackbar = useSnackbar();

  const logout = () => {
    setLoading(true);
    setHome(defaultHome);
    removeHomeFromStorage();
    setLoading(false);
  };

  const deleteHome = () => {
    setLoading(true);
    if (!home || !home._id) return;
    APIHome.deleteHome(home._id)
      .then(({ data, status }) => {
        if (status !== STATUS_OK) {
          throw new Error('Something went wrong when deleting home!');
        }
        removeHomeFromStorage();
        setHome(defaultHome);
        snackbar.setSuccess('Home deleted');
      })
      .catch((err) => snackbar.setError(err.toString()))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const home = getHome();
    home && setHome(home);
  }, []);

  if (loading) {
    return <div>Loading Home...</div>;
  }

  return (
    <HomeContext.Provider
      value={{
        home: home,
        setHome: (home) => {
          setHome(home);
          home && saveHomeInStorage(home);
        },
        logout,
        deleteHome,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

const useAuth = () => useContext(HomeContext);
const useHome = () => useAuth().home;

export { useAuth, useHome };
