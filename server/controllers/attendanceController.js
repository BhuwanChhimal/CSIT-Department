// server/controllers/attendanceController.js
import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;
    const teacherId = req.user._id; // from auth middleware

    // Upsert attendance (update if exists, else create)
    const attendance = await Attendance.findOneAndUpdate(
      { studentId, teacherId, subject, date },
      { status },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceStatus = async (req, res) => {
    try {
        const { studentId, subject } = req.query;
        const query = { studentId };
        if (subject) query.subject = subject;
    
        const records = await Attendance.find(query);
        res.json(records);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const getTeacherAttendanceByDate = async (req, res) => {
  try {
    const teacherId = req.user._id; // from auth middleware
    const { date } = req.query;
    const query = { teacherId };
    if (date) query.date = date;
    const records = await Attendance.find(query);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};