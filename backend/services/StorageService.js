import path from 'path';
import fs from 'fs';

/**
 * Storage Service (SOLID - Dependency Inversion & Single Responsibility)
 * Abstracts file storage operations for local uploads and free cloud hosting services.
 */
export class StorageService {
  constructor(uploadDir = path.join(process.cwd(), 'uploads', 'pyqs')) {
    this.uploadDir = uploadDir;
    this.ensureDirectoryExists();
  }

  ensureDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generates public URL for a stored file
   */
  getFilePublicUrl(filename) {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    return `/uploads/pyqs/${path.basename(filename)}`;
  }

  /**
   * Deletes a file from storage if rejected or removed
   */
  async deleteFile(filename) {
    if (!filename) return false;
    const filePath = path.join(this.uploadDir, path.basename(filename));
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`🗑️ [Storage Service] Deleted file: ${filePath}`);
        return true;
      }
    } catch (err) {
      console.error(`⚠️ [Storage Service] Failed to delete file ${filePath}:`, err.message);
    }
    return false;
  }
}

export default new StorageService();
