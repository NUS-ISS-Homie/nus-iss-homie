import { useSockets } from './SocketContext';
import { useUser } from './UserContext';

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useUser();
  const { createGroceryItem, homeSocket } = useSockets();
}
