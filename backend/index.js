import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import homeRoutes from './routes/home-routes.js';
import userRoutes from './routes/user-routes.js';
import expenseRoutes from './routes/expense-routes.js';
import createEventListeners from './controllers/socket-controller.js';

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
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);
  createEventListeners(socket, io);
});

app.use('/api/home', homeRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/user', userRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.use('/api/expense', expenseRoutes).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

httpServer.listen(port, () => {
  console.log(`Homie listening on port ${port}`);
});

export default app;
