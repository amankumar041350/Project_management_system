import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'intern'],
    required: true,
  },
}, {
  timestamps: true  
});

export default mongoose.models.User || mongoose.model('User', userSchema);
