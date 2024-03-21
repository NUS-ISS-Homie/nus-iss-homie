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
import { STATUS_OK } from '../constants';

const SocketContext = createContext({
  ...sockets,
  joinHome: (homeId: string, onFail?: VoidFunction) => {},
  createGroceryItem: (itemId: string, onFail?: VoidFunction) => {},
});

const getSession = () => {
  return window.localStorage.getItem(LOCAL_STORAGE_SOCKET_KEY);
};

const saveSocketInStorage = (sessionId: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_SOCKET_KEY, sessionId);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const snackbar = useSnackbar();
  const { user_id } = useUser();
  const home = useHome();
  const homeClient = useAuth();

  const joinHome = useCallback((homeId: string, onFail?: VoidFunction) => {
    console.log('join home request');
    const { homeSocket } = sockets;
    homeSocket.emit('join-home', homeId);
  }, []);

  const createGroceryItem = useCallback(
    (itemId: string, onFail?: VoidFunction) => {
      console.log('create grocery item request');
      const { homeSocket } = sockets;
      homeSocket.emit('create-grocery-item', itemId);
    },
    []
  );

  useEffect(() => {
    const { homeSocket } = sockets;

    const sessionId = getSession();
    if (sessionId) {
      homeSocket.auth = { sessionId, userId: user_id };
      homeSocket.connect();
    }

    homeSocket.on('session', ({ sessionId }) => {
      homeSocket.auth = sessionId;
      saveSocketInStorage(sessionId);
      homeSocket.auth = { ...homeSocket.auth, sessionId };
    });

    homeSocket.on('join-home', (homeId) => {
      APIHome.getHome(homeId)
        .then(({ data: { home, message }, status }) => {
          if (status !== STATUS_OK) throw new Error(message);
          homeClient.setHome(home);
          joinHome(homeId);
        })
        .catch((err) => snackbar.setError(err.message));
    });

    homeSocket.on('joined-home', () => {
      if (!home) return;
      APIHome.getHome(home._id)
        .then(({ data: { home, message }, status }) => {
          if (status !== STATUS_OK) throw new Error(message);
          homeClient.setHome(home);
        })
        .catch((err) => snackbar.setError(err.message));
    });
  }, [joinHome, home, user_id, homeClient, snackbar]);

  return (
    <SocketContext.Provider
      value={{
        ...sockets,
        joinHome: joinHome,
        createGroceryItem: createGroceryItem,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

const useSockets = () => useContext(SocketContext);

export { useSockets };
