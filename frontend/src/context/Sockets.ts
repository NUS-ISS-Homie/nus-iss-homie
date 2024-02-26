import { io } from 'socket.io-client';
import { URL_HOME_SVC } from '../configs';

const sockets = {
  homeSocket: io(URL_HOME_SVC),
};

export default sockets;
