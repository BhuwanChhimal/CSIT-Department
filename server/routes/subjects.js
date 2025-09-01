import express from 'express';
import Subject from '../models/Subject.js';

const router = express.Router();
// Upload single subject
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Bulk upload subjects
router.post('/bulk', async (req, res) => {
  try {
    const { subjects } = req.body;
    
    if (!Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: 'Subjects must be an array'
      });
    }

    const createdSubjects = await Subject.insertMany(subjects, { 
      ordered: false // Continue inserting even if some fail
    });
    
    res.status(201).json({
      success: true,
      message: `${createdSubjects.length} subjects uploaded successfully`,
      data: createdSubjects
    });
  } catch (error) {
    if (error.name === 'BulkWriteError') {
      const successfulInserts = error.result.insertedCount;
      const errors = error.writeErrors.map(err => ({
        index: err.index,
        message: err.errmsg
      }));
      
      return res.status(207).json({
        success: true,
        message: `${successfulInserts} subjects uploaded successfully`,
        errors: errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all subjects by semester
router.get('/semester/:semesterNumber', async (req, res) => {
  try {
    const { semesterNumber } = req.params;
    const semester = parseInt(semesterNumber);
    
    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be between 1 and 8'
      });
    }

    const subjects = await Subject.find({
      semester: semester,
      isActive: true
    })
    .populate('prerequisites', 'name code')
    .sort({ code: 1 });

    res.json({
      success: true,
      semester: semester,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all subjects with semester grouping
router.get('/all', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .populate('prerequisites', 'name code')
      .sort({ semester: 1, code: 1 });

    // Group subjects by semester
    const subjectsBySemester = subjects.reduce((acc, subject) => {
      const semester = subject.semester;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(subject);
      return acc;
    }, {});

    res.json({
      success: true,
      data: subjectsBySemester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('prerequisites', 'name code semester');
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update subject
router.put('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete subject (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search subjects
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { semester } = req.query;
    
    let searchFilter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    if (semester) {
      searchFilter.semester = parseInt(semester);
    }

    const subjects = await Subject.find(searchFilter)
      .populate('prerequisites', 'name code')
      .sort({ semester: 1, code: 1 });

    res.json({
      success: true,
      query: query,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;