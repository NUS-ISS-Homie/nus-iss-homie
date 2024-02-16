import 'dotenv/config';
import HomeModel from './home-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
    process.env.ENV == 'PROD'
        ? process.env.DB_CLOUD_URI
        : process.env.DB_CLOUD_URI_TEST;

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));
db.collections['homemodels'].drop().then(() => console.log('Reset Home DB'));

export async function createHomeModel(params) {
    return new HomeModel(params);
}

export async function getHomeModel(roomId) {
    return HomeModel.findOne({ _id: mongoose.Types.ObjectId(roomId) });
}

export async function updateHomeModel(params) {
    return HomeModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(params.homeId) },
        // { $set: {  } },
        { returnDocument: 'after' }
    );
}

export async function deleteHomeModel(homeId) {
    return HomeModel.deleteOne({ _id: mongoose.Types.ObjectId(homeId) });
}