import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChoreSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  home: { type: Schema.Types.ObjectId, ref: 'HomeModel', required: true },
  requestSwapNotificationId: {
    type: Schema.Types.ObjectId,
    ref: 'NotificationModel',
    default: null,
  },
});

export default mongoose.model('ChoreModel', ChoreSchema);
