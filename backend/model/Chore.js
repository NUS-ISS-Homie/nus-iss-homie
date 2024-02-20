import mongoose from 'mongoose';

const choreSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

const Chore = mongoose.model('Chore', choreSchema);

export default Chore;
