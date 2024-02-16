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

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));

router.post('/signup', createUser);
router.post('/login', signIn);
router.post('/change-password', verifyToken, changePassword);
router.post('/change-username', verifyToken, changeUsername);
router.delete('/delete-user', deleteUser);

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
});


app.listen(8000, () => console.log('user-service listening on port 8000'));

export default app;