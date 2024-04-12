import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let GroceryItemModelSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  purchasedDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

GroceryItemModelSchema.index({ user: 1, name: 1 }, { unique: true });
export default mongoose.model('GroceryItemModel', GroceryItemModelSchema);
