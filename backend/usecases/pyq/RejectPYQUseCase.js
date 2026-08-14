import ApiError from '../../utils/ApiError.js';
import pyqService from '../../services/PYQService.js';
import { PYQ_STATUS } from '../../models/QuestionPaper.js';

/**
 * RejectPYQUseCase
 * Delegates domain execution to PYQService.
 */
export class RejectPYQUseCase {
  constructor(service = pyqService) {
    this.service = service;
  }

  async execute(paperId, adminUser, reason = '') {
    if (!adminUser || adminUser.role !== 'admin') {
      throw ApiError.forbidden('Only administrators can reject question paper submissions');
    }

    if (!reason || !reason.trim()) {
      throw ApiError.badRequest('Please provide a reason for rejecting the submission');
    }

    const updatedPaper = await this.service.processAdminReview(
      paperId,
      adminUser,
      PYQ_STATUS.REJECTED,
      reason.trim()
    );

    if (!updatedPaper) {
      throw ApiError.notFound(`Question paper with ID '${paperId}' not found`);
    }

    return {
      success: true,
      message: 'Question paper rejected with feedback provided to student.',
      data: updatedPaper,
    };
  }
}

export default new RejectPYQUseCase();
