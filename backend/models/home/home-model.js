import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HomeModelSchema = new Schema({
  users: {
    type: [Schema.Types.String],
  },
});

export default mongoose.model('HomeModel', HomeModelSchema);
