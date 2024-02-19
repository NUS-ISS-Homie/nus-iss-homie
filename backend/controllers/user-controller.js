import {
    ormCreateUser as _createUser,
    ormGetUser as _getUser,
    ormChangePassword as _changePassword,
    ormChangeUsername as _changeUsername,
    ormDeleteUser as _deleteUser,
} from '../models/user/user-orm.js';
import bcrypt from 'bcrypt';

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
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Username and/or Password are incorrect!' });
            }

            return res.status(201).json({
                username: username,
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
            if (!updated || updated.err) {
                return res.status(400).json({ message: 'Username and/or Password are incorrect!' });
            }

            return res
                .status(200)
                .json({ message: 'Successfully changed password.' });
        }
        return res.status(400).json({ message: 'Missing field(s)!' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when changing password!' });
    }
}

export async function changeUsername(req, res) {
    try {
        const { username, newUsername, password } = req.body;
        if (username && newUsername && password) {
            const updated = await _changeUsername(username, newUsername, password);
            if (!updated) {
                return res.status(401).json({ message: 'Username and/or Password are incorrect!' });
            } else if (updated.err) {
                return res
                    .status(409)
                    .json({ message: `${username} might not exist or already taken` });
            }
            return res
                .status(200)
                .json({ message: 'Successfully changed username.' });
        }
        return res
            .status(400)
            .json({ message: 'Missing field(s)!' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when changing username!' });
    }
}

export async function deleteUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const isDeleted = await _deleteUser(username, password);
            if (!isDeleted || isDeleted.err) {
                return res.status(404).json({ message: 'User does not exist or Username/Password is incorrect!' });
            }
            return res.status(200).json({ message: 'Successfully deleted user.' });
        } else {
            return res.status(400).json({ message: 'Missing field(s)!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when deleting user!' });
    }
}

