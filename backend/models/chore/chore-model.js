import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChoreSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('ChoreModel', ChoreSchema);
