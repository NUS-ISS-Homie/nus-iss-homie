import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import sockets from './Sockets';
import { useSnackbar } from './SnackbarContext';
import { LOCAL_STORAGE_SOCKET_KEY } from '../configs';
import { useUser } from './UserContext';
import { useAuth, useHome } from './HomeContext';
import APIHome from '../utils/api-home';
import { STATUS_OK, homeSocketEvents as events } from '../constants';
import APIGroceryList from '../utils/api-grocery-list';

const SocketContext = createContext({
  ...sockets,
  joinHome: (homeId: string, onFail?: VoidFunction) => {},
  updateGrocery: (homeId: string, onFail?: VoidFunction) => {},
});

const getSession = () => {
  return window.localStorage.getItem(LOCAL_STORAGE_SOCKET_KEY);
};

const saveSocketInStorage = (sessionId: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_SOCKET_KEY, sessionId);
};

export const removeSocketInStorage = () =>
  window.localStorage.removeItem(LOCAL_STORAGE_SOCKET_KEY);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const snackbar = useSnackbar();
  const { user_id } = useUser();
  const home = useHome();
  const homeClient = useAuth();

  const joinHome = useCallback((homeId: string, onFail?: VoidFunction) => {
    const { homeSocket } = sockets;
    homeSocket.emit(events.JOIN_HOME, homeId);
  }, []);

  const updateHome = useCallback(
    (homeId: string | undefined) => {
      if (!homeId) return homeClient.setHome(null);
      APIHome.getHome(homeId)
        .then(({ data: { home, message }, status }) => {
          if (status !== STATUS_OK) throw new Error(message);
          homeClient.setHome(home);
        })
        .catch((err) => snackbar.setError(err.message));
    },
    [homeClient, snackbar]
  );

  const updateGrocery = useCallback(
    (homeId: string | undefined) => {
      if (!homeId) return null;
      APIGroceryList.getListByHomeId(homeId).then(
        ({ data: { list, message }, status }) => {
          if (status !== STATUS_OK) throw new Error(message);
          console.log(list);
        }
      );
    },
    [homeClient, snackbar]
  );

  useEffect(() => {
    const { homeSocket } = sockets;

    // Home Socket Event Listeners
    const sessionId = getSession();
    if (sessionId) {
      homeSocket.auth = { sessionId, userId: user_id, homeId: home?._id };
      homeSocket.connect();
    }

    const onSession = (data: { sessionId: string }) => {
      const { sessionId } = data;
      saveSocketInStorage(sessionId);
      homeSocket.auth = { ...homeSocket.auth, sessionId };
    };

    const onJoinHome = (homeId: string) => {
      updateHome(homeId);
      if (!home) return;
      joinHome(homeId);
    };

    const onUpdateHome = () => updateHome(home?._id);

    homeSocket.on(events.SESSION, onSession);
    homeSocket.on(events.JOIN_HOME, onJoinHome);
    homeSocket.on(events.UPDATE_HOME, onUpdateHome);

    return () => {
      // Remove event listeners to prevent duplicate event registrations
      homeSocket.off(events.SESSION, onSession);
      homeSocket.off(events.JOIN_HOME, onJoinHome);
      homeSocket.off(events.UPDATE_HOME, onUpdateHome);
    };
  }, [joinHome, updateHome, home, user_id, homeClient, snackbar]);

  return (
    <SocketContext.Provider
      value={{ ...sockets, joinHome: joinHome, updateGrocery: updateGrocery }}
    >
      {children}
    </SocketContext.Provider>
  );
}

const useSockets = () => useContext(SocketContext);

export { useSockets };
