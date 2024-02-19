import {
    createUser,
    getUser,
    changePassword,
    changeUsername,
    deleteUser,
} from './user-repository.js';
import 'dotenv/config';

// CREATE FUNCTION
export async function ormCreateUser(username, hashedPassword) {
    try {
        const newUser = await createUser({ username, hashedPassword });
        await newUser.save();
        return true;
    } catch (err) {
        return { err };
    }
}

// READ FUNCTION
export async function ormGetUser(username) {
    try {
        const user = await getUser(username);
        return user;
    } catch (err) {
        console.log(
            `ERROR: Could not get user from DB. Wrong username / password.`
        );
        return { err };
    }
}

// UPDATE FUNCTION
export async function ormChangePassword(
    username,
    oldPassword,
    newHashedPassword
) {
    try {
        const updatedUser = await changePassword({
            username,
            oldPassword,
            newHashedPassword,
        });
        console.log(updatedUser);
        return updatedUser;
    } catch (err) {
        return { err };
    }
}

export async function ormChangeUsername(username, newUsername, password) {
    try {
        const updatedUser = await changeUsername({
            username,
            newUsername,
            password,
        });
        return updatedUser;
    } catch (err) {
        return { err };
    }
}

// DELETE FUNCTION
export async function ormDeleteUser(username, password) {
    try {
        const isDeleted = await deleteUser({ username, password });
        return isDeleted;
    } catch (err) {
        return { err };
    }
}