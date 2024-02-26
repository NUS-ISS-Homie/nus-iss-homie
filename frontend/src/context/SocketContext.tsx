import React, { createContext, useContext } from 'react';
import sockets from './Sockets';

const SocketContext = createContext({
    ...sockets,
    joinHome: (home: string, onFail: VoidFunction) => { },
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const joinHome = async (home: string, onFail: VoidFunction) => {

        const { homeSocket } = sockets;

        homeSocket.emit('join-home', { room: home });
    };

    return (
        <SocketContext.Provider value={{ ...sockets, joinHome: joinHome }}>
            {children}
        </SocketContext.Provider>
    );
}

const useSockets = () => useContext(SocketContext);

export { useSockets };