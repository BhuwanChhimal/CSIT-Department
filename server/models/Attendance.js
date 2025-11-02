// server/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true }, // Use string for easy matching (e.g. "2024-06-01")
  status: { type: String, enum: ["Present", "Absent"], required: true },
});

export default mongoose.model("Attendance", attendanceSchema);