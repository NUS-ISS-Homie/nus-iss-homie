import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HomeModelSchema = new Schema({
  adminUser: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    unique: true,
  },
  users: { type: [Schema.Types.ObjectId], ref: 'UserModel' },
});

export default mongoose.model('HomeModel', HomeModelSchema);
