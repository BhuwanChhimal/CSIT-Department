// models/Subject.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  chapters: {
    type: Number,
    required: true,
    min: 1
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  credits: {
    type: Number,
    min: 1,
    max: 6
  },
  type: {
    type: String,
    enum: ['core', 'elective', 'practical', 'project'],
    default: 'core'
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
subjectSchema.index({ semester: 1, isActive: 1 });
subjectSchema.index({ code: 1 });

export default mongoose.model('Subject', subjectSchema);
