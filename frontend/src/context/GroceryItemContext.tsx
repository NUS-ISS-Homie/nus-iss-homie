import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSockets } from './SocketContext';
import { useUser } from './UserContext';

interface IGroceryContext {}

const GroceryContext = createContext<IGroceryContext>({});

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();
  const { createGroceryItem, homeSocket } = useSockets();
  const [loading, setLoading] = useState(false);

  const createGrocery = () => {
    setLoading(true);
  };

  return (
    <GroceryContext.Provider value={{}}>{children}</GroceryContext.Provider>
  );
}
