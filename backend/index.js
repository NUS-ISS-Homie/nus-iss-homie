import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
    changePassword,
    changeUsername,
    createUser,
    deleteUser,
    signIn,
} from './controllers/user-controller.js';
import { verifyToken } from './middlewares/auth-jwt.js';

const userRouter = express.Router();
const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from Homie'));
userRouter.get('/', (_, res) => res.send('Hello World from user-service'));

userRouter.post('/signup', createUser);
userRouter.post('/login', signIn);
userRouter.post('/change-password', verifyToken, changePassword);
userRouter.post('/change-username', verifyToken, changeUsername);
userRouter.delete('/delete-user', deleteUser);

app.use('/api/user', userRouter).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
});


app.listen(8000, () => console.log('Homie listening on port 8000'));

export default app;