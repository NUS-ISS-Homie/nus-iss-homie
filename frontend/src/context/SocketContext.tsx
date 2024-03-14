import React, { createContext, useContext, useEffect } from 'react';
import sockets from './Sockets';
import { useSnackbar } from './SnackbarContext';
import APINotification from '../utils/api-notification';

const SocketContext = createContext({
  ...sockets,
  joinHome: (homeId: string, onFail?: VoidFunction) => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const snackbar = useSnackbar();
  const joinHome = (homeId: string, onFail?: VoidFunction) => {
    console.log('join home request');
    const { homeSocket } = sockets;
    homeSocket.on('joined-home', () => {
      snackbar.setSuccess('Successfully joined home socket');
    });
    homeSocket.emit('join-home', homeId);
  };

  return (
    <SocketContext.Provider value={{ ...sockets, joinHome: joinHome }}>
      {children}
    </SocketContext.Provider>
  );
}

const useSockets = () => useContext(SocketContext);

export { useSockets };
