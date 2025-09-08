// server/controllers/adminController.js
import User from "../models/User.js";

export const getPendingUsers = async (req, res) => {
  try {
    const role = req.query.role; // 'student' or 'teacher'
    const users = await User.find({ 
      role: role,
      isApproved: false 
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, 
      { isApproved: true },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};
export const getAllStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllTeachers = async (req, res) => {
  try {
    const users = await User.find({ role: "teacher" }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// server/controllers/adminController.js
export const assignSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjects } = req.body; // array of subject names
    const user = await User.findByIdAndUpdate(
      teacherId,
      { subjects },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};