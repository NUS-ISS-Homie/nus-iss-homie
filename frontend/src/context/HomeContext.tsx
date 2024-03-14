import React, { createContext, useState, useContext, useEffect } from 'react';
import { Home } from '../@types/HomeContext';
import { LOCAL_STORAGE_HOME_KEY } from '../configs';
import { STATUS_OK } from '../constants';
import { useSnackbar } from './SnackbarContext';
import APIHome from '../utils/api-home';
import { useSockets } from './SocketContext';

const getHome = () => {
  const homeStr = window.localStorage.getItem(LOCAL_STORAGE_HOME_KEY);
  return homeStr ? JSON.parse(homeStr) : null;
};

const removeHomeFromStorage = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_HOME_KEY);
};

const saveHomeInStorage = (home: Home) => {
  window.localStorage.setItem(LOCAL_STORAGE_HOME_KEY, JSON.stringify(home));
};

interface IHomeContext {
  home: Home | null;
  setHome: (home: Home | null) => void;
  deleteHome: VoidFunction;
  acceptJoinRequest: (sender: string, callback?: VoidFunction) => void;
}

const HomeContext = createContext<IHomeContext>({
  home: null,
  setHome: (home: Home | null) => {},
  deleteHome: () => {},
  acceptJoinRequest: (sender: string, callback?: VoidFunction) => {},
});

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(false);
  const { joinHome, homeSocket } = useSockets();

  const snackbar = useSnackbar();

  const deleteHome = () => {
    setLoading(true);
    if (!home || !home._id) return;
    APIHome.deleteHome(home._id)
      .then(({ data, status }) => {
        if (status !== STATUS_OK) {
          throw new Error('Something went wrong when deleting home!');
        }
        setHome(null);
        snackbar.setSuccess('Home deleted');
      })
      .catch((err) => snackbar.setError(err.toString()))
      .finally(() => setLoading(false));
  };

  const acceptJoinRequest = (sender: string, callback?: VoidFunction) => {
    if (!home) return;
    APIHome.joinHome(home._id.toString(), sender)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        if (!home || !home._id) return;
        setHome(home);
        console.log('AUTH:', homeSocket.auth);
        homeSocket.emit('accept-join-req', {
          homeId: home._id,
          userId: sender,
        });
        callback && callback();
      })
      .catch((err: Error) => snackbar.setError(err.message));
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
          if (!home) {
            removeHomeFromStorage();
          } else {
            saveHomeInStorage(home);
            joinHome(home._id);
          }
          setHome(home);
        },
        deleteHome,
        acceptJoinRequest,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

const useAuth = () => useContext(HomeContext);
const useHome = () => useAuth().home;

export { useAuth, useHome };
