import UserModel from './user-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
    process.env.ENV == 'PROD'
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// CREATE FUNCTION
export async function createUser(params) {
    return await UserModel.create({
        username: params.username,
        hashedPassword: params.hashedPassword,
    });
    // return new UserModel(params);
}

// READ FUNCTION
export async function getUser(username) {
    const user = await UserModel.findOne({ username: username });
    return user;
}

export async function getToken(username) {
    const user = await UserModel.findOne({ username: username }, 'token');
    return user.token;
}

// UPDATE FUNCTION
export async function changePassword(params) {
    console.log(params);
    const user = await UserModel.findOne({ username: params.username });
    if (!user) {
        throw new Error('Database Error');
    }

    if (user.comparePassword(params.oldPassword)) {
        const updated = await UserModel.updateOne(
            { username: params.username },
            { $set: { hashedPassword: params.newHashedPassword } }
        );
        return updated;
    }
}

export async function changeUsername(params) {
    console.log(params);
    const user = await UserModel.findOne({ username: params.username });
    if (!user) {
        throw new Error('Database Error');
    }

    if (user.comparePassword(params.password)) {
        const updated = await UserModel.updateOne(
            { username: params.username },
            { $set: { username: params.newUsername } }
        );
        return updated;
    }
}

export async function addTokenToUser(params) {
    const updated = await UserModel.updateOne(
        { username: params.username },
        { $set: { token: params.token } }
    );
    return updated;
}

// DELETE FUNCTION
export async function deleteUser(username) {
    const user = await UserModel.findOne({ username: username });
    if (user) {
        const deleted = await UserModel.deleteOne({ username: username });
        console.log(deleted);
        return deleted.acknowledged;
    }
}

export async function deleteToken(username, token) {
    console.log('Username : ', username);
    console.log('Token : ', token);
    const user = await UserModel.findOne({ username: username });
    return await user.updateOne({ $unset: { token: '' } });
}