import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  srfNumber: {
    type: String,
    required: true,
    
  },
  clientName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['web', 'electronics'],
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  cycleNumber: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  dateOfStart: {
    type: Date,
    required: true,
  },
  deadlineDate: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
