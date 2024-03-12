import mongoose from 'mongoose';

var Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: Schema.Types.String, required: true },
  content: { type: Schema.Types.String, required: true },
});

let NotificationModelSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
  recipients: {
    type: [Schema.Types.ObjectId],
    ref: 'UserModel',
    required: true,
  },
  message: { type: MessageSchema, required: true },
  expireAt: { type: Schema.Types.Date, expires: 60 * 24 * 30 }, // expires at 30 days
});

export default mongoose.model('NotificationModel', NotificationModelSchema);
