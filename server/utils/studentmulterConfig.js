// studentUpload.js
import multer from "multer";
import path from "path";

// Student submission storage
const studentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/submissions"); // student submitted files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const studentUpload = multer({
  storage: studentStorage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default studentUpload;
