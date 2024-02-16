import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
  token: {
    type: String,
    required: false,
  },
});

UserModelSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

export default mongoose.model("UserModel", UserModelSchema);