import { io } from 'socket.io-client';
import { SOCKET_NAMESPACE_HOME, URI_BACKEND } from '../configs';

const sockets = {
  homeSocket: io(`${URI_BACKEND}/${SOCKET_NAMESPACE_HOME}`),
};

export default sockets;
