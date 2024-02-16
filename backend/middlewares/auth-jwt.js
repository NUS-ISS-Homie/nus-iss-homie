import { ormGetToken as _getToken } from '../models/user/user-orm.js';
import { decodeToken, isValidRequest } from '../utils/token.js';
import 'dotenv/config';

const isMatchingCredential = (fromDb, fromUser) => {
    return (
        fromDb.username === fromUser.username &&
        fromDb.hashedPassword === fromUser.hashedPassword &&
        fromDb._id === fromUser._id
    );
};

export async function verifyToken(req, res, next) {
    if (process.env.ENV == 'TEST') {
        next();
        return;
    }

    if (!isValidRequest(req)) {
        return res.status(401).json({ message: 'Missing JWT token!' });
    }

    const username = req.body.username;
    const tokenFromDb = await _getToken(username);
    const tokenFromUser = req.headers.authorization.split(' ')[1];
    try {
        const fromDb = decodeToken(tokenFromDb, process.env.JWT_PRIVATE_KEY);
        const fromUser = decodeToken(tokenFromUser, process.env.JWT_PRIVATE_KEY);

        if (!isMatchingCredential(fromDb, fromUser)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        req.user_id = fromUser._id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid JWT token!' });
    }
}