import React, { createContext, useState, useContext, useEffect } from 'react';
import { Home } from '../@types/HomeContext';
import { LOCAL_STORAGE_HOME_KEY } from '../configs';
import { STATUS_OK, homeSocketEvents as events } from '../constants';
import { useSnackbar } from './SnackbarContext';
import APIHome from '../utils/api-home';
import { useSockets } from './SocketContext';
import { useUser } from './UserContext';

interface IGroceryContext {
  list: null;
  updateGroceries: VoidFunction;
}

const GroceryContext = createContext<IGroceryContext>({
  list: null,
  updateGroceries: () => {},
});

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();
  const { joinHome, homeSocket } = useSockets();
  const snackbar = useSnackbar();

  const updateGroceries = () => {
    console.log('ping!');
    homeSocket.emit(events.UPDATE_GROCERIES, {
      homeId: '12345',
    });
  };

  return (
    <GroceryContext.Provider
      value={{
        list: null,
        updateGroceries,
      }}
    ></GroceryContext.Provider>
  );
}

const useGroceryAuth = () => useContext(GroceryContext);

export { useGroceryAuth };
