import {
    ormCreateUser as _createUser,
    ormDeleteToken as _logout,
    ormGetToken as _getToken,
    ormGetUser as _getUser,
    ormAddTokenToUser as _addToken,
    ormChangePassword as _changePassword,
    ormChangeUsername as _changeUsername,
    ormDeleteUser as _deleteUser,
} from '../models/user/user-orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        let saltRounds = parseInt(process.env.SALT_ROUNDS);

        if (username && password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const resp = await _createUser(username, hashedPassword);
            console.log('response controller: ');
            console.log(resp);
            if (resp.err) {
                if (
                    resp.err.name &&
                    resp.err.name === 'MongoServerError' &&
                    resp.err.code === 11000
                ) {
                    return res
                        .status(409)
                        .json({ message: `User ${username} already exists!` });
                }
                return res
                    .status(400)
                    .json({ message: 'Could not create a new user!' });
            } else {
                console.log(`Created new user ${username} successfully!`);
                return res
                    .status(201)
                    .json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res
                .status(400)
                .json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when creating new user!' });
    }
}

export async function signIn(req, res) {
    try {
        const { username, password } = req.body;
        console.log(username)
        if (username && password) {
            const user = await _getUser(username);
            if (user.err) {
                return res.status(400).json({ message: 'Could not sign in!' });
            }
            const isPasswordCorrect = user.comparePassword(password);
            console.log(isPasswordCorrect)
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Wrong password' });
            }

            let token = await generateToken(user);

            const updated = await _addToken(username, token);

            return res.status(201).json({
                username: username,
                token: token,
                user_id: user._id,
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: `User does not exist` });
    }
}

export async function changePassword(req, res) {
    try {
        const { username, oldPassword, newPassword } = req.body;
        if (username && oldPassword && newPassword) {
            let saltRounds = parseInt(process.env.SALT_ROUNDS);
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
            const updated = await _changePassword(
                username,
                oldPassword,
                hashedNewPassword
            );
            if (!updated) {
                return res.status(400).json({ message: 'Wrong password!' });
            }
            return res
                .status(200)
                .json({ message: 'Successfully changed password.' });
        }
        return res.status(400).json({ message: 'Missing fields!' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when changing password!' });
    }
}

export async function changeUsername(req, res) {
    // Todo: Check token in header
    // Todo: handle existing username
    try {
        const { username, newUsername, password } = req.body;
        if (username && newUsername && password) {
            const updated = await _changeUsername(username, newUsername, password);
            if (!updated) {
                return res.status(401).json({ message: 'Wrong password!' });
            } else if (updated.err) {
                return res
                    .status(409)
                    .json({ message: `User ${username} already exists` });
            }
            return res
                .status(200)
                .json({ message: 'Successfully changed username.' });
        }
        return res
            .status(400)
            .json({ message: 'Username and/or Password are missing!' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when changing username!' });
    }
}

export async function deleteUser(req, res) {
    // TODO : CHECK BEARER TOKEN (AUTHORIZATION)
    // TODO : Token in req.body
    try {
        const { username } = req.body;
        if (username) {
            const isDeleted = await _deleteUser(username);
            console.log('Controller: ' + JSON.stringify(isDeleted));
            if (!isDeleted) {
                return res.status(404).json({ message: 'User does not exist!' });
            }
            return res.status(200).json({ message: 'Successfully deleted user.' });
        } else {
            return res.status(400).json({ message: 'Username is missing!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when changing username!' });
    }
}

export async function generateToken(user) {
    let privateKey = process.env.JWT_PRIVATE_KEY;

    let token = await jwt.sign(
        {
            username: user.username,
            hashedPassword: user.hashedPassword,
            _id: user._id,
        },
        privateKey,
        { expiresIn: '2h' }
    );
    console.log(token);
    return token;
}

export async function connectToRedis() {
    redisClient.on('error', (error) => {
        console.log('Redis client error ' + error);
    });
    redisClient.on('connect', () => {
        console.log('Redis connected!');
    });

    await redisClient.connect();
}

export async function loginWithToken(req, res) {
    try {
        return res.status(201).json({
            message: `Successfully log ${req.body.username} in with token!`,
            username: req.body.username,
            user_id: req.user_id,
        });
    } catch (err) {
        return res.status(500).json({
            message: `Database failure!`,
        });
    }
}

export async function logout(req, res) {
    try {
        const { username, token } = req.body;

        if (username && token) {
            const resp = await _logout(username, token);
            console.log(resp);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: `Could not logout ${username}!` });
            } else {
                await insertTokenToBlacklist(token);
                return res
                    .status(201)
                    .json({ message: `Log ${username} out successfully!` });
            }
        } else {
            return res
                .status(400)
                .json({ message: 'Username and/or token are missing!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when logging out!' });
    }
}

export async function insertTokenToBlacklist(token) {
    const { iat } = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const expiryDate = iat + 60;

    const token_key = `bl_${token}`;
    await redisClient.set(token_key, token);
    redisClient.expireAt(token_key, expiryDate);
}

export async function isTokenInBlacklist(token) {
    const inDenyList = await redisClient.get(`bl_${token}`);

    return inDenyList;
}