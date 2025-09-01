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
export const deleteAssignment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
          return res.status(403).json({ message: "Access denied. Teachers only." });
        }
    
        const deleted = await Assignment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Assignment not found" });
    
        res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment' });
  }
}
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

export const submitAssignment = async (req, res) => {
  try {
  
    const { assignmentId } = req.params;
    const studentId = req.user._id;
    const fileUrl = req.file?.path;

    console.log("Params:", assignmentId);
    console.log("File:", req.file.path);
    console.log("User:", req.user._id);

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.submissions.push({
      student: studentId,
      fileUrl,
      submittedAt: new Date()
    });

    await assignment.save();
    res.status(200).json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment' });
  }
}

export const getSubmissionsForTeacher = async (req, res) => {
  try {
    const {assignmentId} = req.params;

    const assignment = await Assignment.findById(assignmentId).populate('submissions.student', 'name email').populate("teacher","name email");
    if(!assignment){
      return res.status(404).json({message: 'Assignment not found'});
    }

    if(assignment.teacher._id.toString() !== req.user._id.toString()){
      return res.status(403).json({message: 'Not authorized to view submissions for this assignment'});
    }
    res.status(200).json(assignment.submissions);
  } catch (error) {
    res.status(500).json({message: 'Error fetching submissions'});
  }
}