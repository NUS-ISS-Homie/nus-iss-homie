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
  username: {
    type: String,
    required: true,
  },
});

export default mongoose.model('ExpenseModel', ExpenseSchema);
