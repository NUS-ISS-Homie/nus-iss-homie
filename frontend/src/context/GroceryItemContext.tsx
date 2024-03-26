import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSockets } from './SocketContext';
import { useUser } from './UserContext';
import sockets from './Sockets';
import { GroceryItem } from '../@types/GroceryItemContext';

interface IGroceryContext {
  item: GroceryItem | null;
}

const GroceryContext = createContext<IGroceryContext>({
  item: null,
});

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();
  const { createGroceryItem, homeSocket } = useSockets();
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState<GroceryItem | null>(null);

  const createGrocery = () => {
    setLoading(true);
  };

  return (
    <GroceryContext.Provider
      value={{
        item: item,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

const useItemAuth = () => useContext(GroceryContext);
const useItem = useItemAuth().item;

export { useItemAuth, useItem };
