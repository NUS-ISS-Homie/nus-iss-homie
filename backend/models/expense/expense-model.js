import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
  home: { type: Schema.Types.ObjectId, ref: 'HomeModel', required: true },
});

export default mongoose.model('ExpenseModel', ExpenseSchema);
