import React, { createContext, useState, useContext, useEffect } from 'react';
import { Home } from '../@types/HomeContext';
import { LOCAL_STORAGE_HOME_KEY } from '../configs';
import { STATUS_OK } from '../constants';
import { useSnackbar } from './SnackbarContext';
import APIHome from '../utils/api-home';
import { useSockets } from './SocketContext';
import { useUser } from './UserContext';

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
  leaveHome: VoidFunction;
  deleteHome: VoidFunction;
  acceptJoinRequest: (sender: string, callback?: VoidFunction) => void;
  acceptInvite: (admin: string, callback?: VoidFunction) => void;
  updateHome: VoidFunction;
}

const HomeContext = createContext<IHomeContext>({
  home: null,
  setHome: (home: Home | null) => {},
  leaveHome: () => {},
  deleteHome: () => {},
  acceptJoinRequest: (sender: string, callback?: VoidFunction) => {},
  acceptInvite: (admin: string, callback?: VoidFunction) => {},
  updateHome: () => {},
});

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();

  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(false);
  const { joinHome, homeSocket } = useSockets();

  const snackbar = useSnackbar();

  const leaveHome = () => {
    setLoading(true);
    if (!home || !user_id) return;
    APIHome.leaveHome(user_id)
      .then(({ data: { message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        setHome(null);
        removeHomeFromStorage();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message))
      .finally(() => setLoading(false));
  };

  const deleteHome = () => {
    setLoading(true);
    if (!home || user_id !== home.adminUser._id) return;
    APIHome.deleteHome(home._id)
      .then(({ data: { message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        setHome(null);
        removeHomeFromStorage();
        snackbar.setSuccess(message);
      })
      .catch((err) => snackbar.setError(err.message))
      .finally(() => setLoading(false));
  };

  const acceptJoinRequest = (sender: string, callback?: VoidFunction) => {
    if (!home) return;
    APIHome.joinHome(home._id, sender)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        if (!home || !home._id) return;
        saveHomeInStorage(home);
        setHome(home);
        homeSocket.emit('accept-join-req', {
          homeId: home._id,
          userId: sender,
        });
        callback && callback();
      })
      .catch((err: Error) => snackbar.setError(err.message));
  };

  const acceptInvite = (admin: string, callback?: VoidFunction) => {
    if (!user_id) return;
    APIHome.getHomeByUserId(admin)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        APIHome.joinHome(home._id, user_id).then(
          ({ data: { home, message }, status }) => {
            if (status !== STATUS_OK) throw new Error(message);
            if (!home || !home._id) return;
            saveHomeInStorage(home);
            setHome(home);
            homeSocket.emit('join-home', home._id);
            callback && callback();
          }
        );
      })
      .catch((err: Error) => snackbar.setError(err.message));
  };

  const updateHome = () => {
    if (!home) return;
    APIHome.getHome(home._id)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        saveHomeInStorage(home);
        setHome(home);
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
        leaveHome,
        deleteHome,
        acceptJoinRequest,
        acceptInvite,
        updateHome,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

const useAuth = () => useContext(HomeContext);
const useHome = () => useAuth().home;

export { useAuth, useHome };
