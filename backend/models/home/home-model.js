import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HomeModelSchema = new Schema({
  adminUser: { type: Schema.Types.String, required: true, unique: true },
  users: { type: [Schema.Types.String] },
});

export default mongoose.model('HomeModel', HomeModelSchema);
