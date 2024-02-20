import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import homeRouter from './routes/home-routes.js';
import createEventListeners from './controllers/socket-controller.js';
import 'dotenv/config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World from Homie!');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.ORIGIN || 'http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);
  createEventListeners(socket, io);
});

app.use('/api/home', homeRouter).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
