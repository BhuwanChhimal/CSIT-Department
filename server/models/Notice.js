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
  attachments: [
    {
      fileName: String,
      fileUrl: String,
    },
  ],
  readMoreLink: {
    type: String,
  },
});

export default mongoose.model("Notice", noticeSchema);
