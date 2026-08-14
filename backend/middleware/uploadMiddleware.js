import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

// Ensure upload directory exists (uses /tmp on Vercel serverless environment)
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads', 'pyqs')
  : path.join(process.cwd(), 'uploads', 'pyqs');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️ Could not create upload directory:', err.message);
}

// Disk Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Re-verify directory exists before saving file in serverless lambda execution
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {
      // Ignored if /tmp exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File Filter (Only allow PDFs and Images)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type '${file.mimetype}'. Only PDF documents and JPG/PNG images are allowed.`
      ),
      false
    );
  }
};

/**
 * Multer Upload Middleware Configuration
 * Max File Size: 15MB
 */
export const uploadPYQFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
  },
});
