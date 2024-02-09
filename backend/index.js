import express from 'express'
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from Homie!'));

const port = process.env.PORT;

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


app.use('/', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export default app;
