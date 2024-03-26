import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSockets } from './SocketContext';
import { useUser } from './UserContext';
import sockets from './Sockets';
import { GroceryItem } from '../@types/GroceryItemContext';

interface IGroceryContext {
  item: GroceryItem | null;
  groceryTest: VoidFunction;
  groceryEmit: (sender: string, callback?: VoidFunction) => void;
}

const GroceryContext = createContext<IGroceryContext>({
  item: null,
  groceryTest: () => {},
  groceryEmit: () => {},
});

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();
  const { createGroceryItem, homeSocket } = useSockets();
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState<GroceryItem | null>(null);

  const createGrocery = () => {
    setLoading(true);
  };

  const groceryTest = () => {
    console.log('grocery test working');
  };

  const groceryEmit = (sender: string) => {
    console.log('attempting emit');
    homeSocket.emit('create-grocery-item', {
      itemId: 'abcde',
      userId: sender,
    });
  };

  return (
    <GroceryContext.Provider
      value={{
        item: item,
        groceryTest,
        groceryEmit,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

const useItemAuth = () => useContext(GroceryContext);
const useItem = () => useItemAuth().item;

export { useItemAuth, useItem };
