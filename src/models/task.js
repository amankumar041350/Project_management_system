// models/task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  deadline: Date,
  assignDate: Date,
  completedBy: String,
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
