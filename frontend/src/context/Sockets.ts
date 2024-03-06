import { io } from 'socket.io-client';
import { URI_BACKEND } from '../configs';

const sockets = {
  homeSocket: io(URI_BACKEND),
};

export default sockets;
