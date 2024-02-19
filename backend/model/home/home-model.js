import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HomeModelSchema = new Schema({
    // code: {
    //     type: Schema.Types.UUID,
    //     required: true,
    //     unique: true
    // },
    users: {
        type: [Schema.Types.ObjectId],
    }
});

export default mongoose.model('HomeModel', HomeModelSchema);
