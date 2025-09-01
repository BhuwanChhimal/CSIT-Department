import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Examinations", "Academic", "Research", "Events", "General"],
    required: true,
  },
  type: {
    type: String,
    enum: ["Important", "Event", "Notice"],
    default: "Notice",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  fileUrl: {
    type: String,
    required: false, // ✅ Changed from required: true to false
  },
  fileName: String,
  fileType: String,
  fileSize: Number,
  readMoreLink: {
    type: String,
  },
}, {
  timestamps: true // ✅ Added timestamps for better tracking
});

export default mongoose.model("Notice", noticeSchema);