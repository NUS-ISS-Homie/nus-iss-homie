import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

var Schema = mongoose.Schema;
let UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

UserModelSchema.methods.comparePassword = function (password) {
  return bcryptjs.compareSync(password, this.hashedPassword);
};

export default mongoose.model('UserModel', UserModelSchema);
