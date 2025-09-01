import Notice from "../models/Notice.js";

// Create a new notice (admin only)
export const createNotice = async (req, res) => {
  try {
    // check if user is admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const {
      title,
      description,
      category,
      type,
      date,
      pinned,
      readMoreLink,
    } = req.body;

    const file = req.file;

        // Validate required fields
        if (!title || !description) {
          return res.status(400).json({ 
            message: "Title and description are required." 
          });
        }
    
     // Create notice object with conditional file properties
     const noticeData = {
      title,
      description,
      category,
      type,
      date: date || new Date(),
      pinned: pinned === 'true' || pinned === true, // Handle string conversion
      readMoreLink,
    };

    if (file) {
      noticeData.fileUrl = file.path;
      noticeData.fileName = file.originalname;
      noticeData.fileType = file.mimetype;
      noticeData.fileSize = file.size;
    }
    const newNotice = new Notice(noticeData);
    await newNotice.save();
    res.status(201).json({ message: "Notice created successfully", notice: newNotice });
  } catch (error) {
    res.status(500).json({ message: "Error creating notice", error: error.message });
  }
};

// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1, pinned: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices", error: error.message });
  }
};

// Get a single notice by ID
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    // increase views when fetching
    notice.views += 1;
    await notice.save();

    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notice", error: error.message });
  }
};

// Delete notice (admin only)
export const deleteNotice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notice not found" });

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice", error: error.message });
  }
};
