// src/core/middlewares/uploadMiddleware.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // For creating 'uploads' directory if using diskStorage
import { ApiError } from '../utils/apiError'; // Adjust path

// Ensure 'uploads/' directory exists if using diskStorage
const uploadDir = path.join(__dirname, '../../../uploads'); // Adjust path to root/uploads
if (!fs.existsSync(uploadDir)) {
  // fs.mkdirSync(uploadDir, { recursive: true }); // Create if using diskStorage
}

// Option 1: Store in memory (good for small files, directly pipe to Cloudinary or process buffer)
const memoryStorage = multer.memoryStorage();

// Option 2: Store temporarily on disk (if you need to process before upload or for larger files)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to 'uploads/' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'File upload only supports the following filetypes: ' + allowedTypes) as any);
  }
};

// Choose your storage: memoryStorage or diskStorage
export const upload = multer({
  storage: diskStorage, // Change to memoryStorage if preferred
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});