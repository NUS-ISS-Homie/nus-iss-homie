import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let NotificationModelSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true },
  recipients: { type: [Schema.Types.ObjectId], required: true },
  message: { type: Schema.Types.String, required: true },
  expireAt: { type: Schema.Types.Date, expires: 60 * 24 * 30 }, // expires at 30 days
});

export default mongoose.model('NotificationModel', NotificationModelSchema);
