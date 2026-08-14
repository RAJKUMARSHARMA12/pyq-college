import ApiError from '../../utils/ApiError.js';
import pyqService from '../../services/PYQService.js';

/**
 * UploadPYQUseCase
 * Delegates domain execution to PYQService.
 */
export class UploadPYQUseCase {
  constructor(service = pyqService) {
    this.service = service;
  }

  async execute({ title, subject, course, academicYear, examType, fileUrl, solutionUrl, user }) {
    if (!title || !fileUrl) {
      throw ApiError.badRequest('Title and Question Paper File are required');
    }

    if (!user) {
      throw ApiError.unauthorized('User identity required to upload paper');
    }

    const payload = {
      title: title.trim(),
      subject,
      course,
      academicYear: Number(academicYear) || new Date().getFullYear(),
      examType: examType || 'End-Sem',
      fileUrl,
      solutionUrl: solutionUrl || '',
    };

    const newPaper = await this.service.processStudentUpload(payload, user);

    return {
      success: true,
      message: 'Question paper submitted successfully! It is pending admin review.',
      data: newPaper,
    };
  }
}

export default new UploadPYQUseCase();
