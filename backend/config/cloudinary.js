import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

let cloudinaryV2 = null;

/**
 * Check if Cloudinary environment credentials are set
 */
export const isCloudinaryConfigured = () => {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Dynamic Upload Helper (Cloudinary when configured, local storage fallback)
 * Uses resource_type: 'auto', flags: 'attachment:false' and public access settings
 */
export const uploadToCloudinary = async (filePath, folder = 'prores_pyqs') => {
  if (!filePath) return null;

  // Fallback to local disk URL if Cloudinary credentials are not set
  if (!isCloudinaryConfigured()) {
    console.log('ℹ️ Cloudinary credentials not configured — storing file locally under /uploads/pyqs/');
    const filename = filePath.split('/').pop();
    return `/uploads/pyqs/${filename}`;
  }

  try {
    // Dynamically load Cloudinary SDK if present
    if (!cloudinaryV2) {
      const cloudinaryModule = await import('cloudinary');
      cloudinaryV2 = cloudinaryModule.v2;
      cloudinaryV2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }

    const result = await cloudinaryV2.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      type: 'upload',
      access_mode: 'public',
      invalidate: true,
      use_filename: true,
      unique_filename: true,
    });

    // Remove local temp file after Cloudinary upload
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Could not delete temp file after Cloudinary upload:', e.message);
      }
    }

    console.log(`✅ Uploaded to Cloudinary successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.warn(`⚠️ Cloudinary upload warning (${error.message}) — falling back to local file storage.`);
    const filename = filePath.split('/').pop();
    return `/uploads/pyqs/${filename}`;
  }
};
