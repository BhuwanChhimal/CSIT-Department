import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: String,
  fileType: String,
  fileSize: Number,
  dueDate: {
    type: Date,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  submissions:[
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      fileUrl: String,
      fileName: String,
      fileType: String,
      fileSize: Number,
      submittedAt: {
        type: Date,
        default: Date.now
      },
      grade:{
        type: String,
        enum: ["A+", "A", "B+", "B", "C+", "C", "D", "E"],
        default: null
      }
    }
  ]
});

export default mongoose.model('Assignment', assignmentSchema);