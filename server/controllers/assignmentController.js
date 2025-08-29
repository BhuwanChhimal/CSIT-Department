import Assignment from '../models/Assignment.js';

export const uploadAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, semester, subject } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const assignment = new Assignment({
      title,
      description,
      fileUrl: file.path,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      dueDate,
      semester,
      subject,
      teacher: req.user._id
    });

    await assignment.save();

    res.status(201).json({
      message: 'Assignment uploaded successfully',
      assignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading assignment' });
  }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user._id })
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .populate('teacher', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};