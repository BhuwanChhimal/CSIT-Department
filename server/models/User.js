import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'] },
  createdAt: { type: Date, default: Date.now },
  subjects: [{ type: String }],
  isApproved: {
    type: Boolean,
    default: false
  } // New field to track approval status
});

export default mongoose.model('User', userSchema);
