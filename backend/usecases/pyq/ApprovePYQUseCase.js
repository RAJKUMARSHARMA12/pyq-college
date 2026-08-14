import ApiError from '../../utils/ApiError.js';
import pyqService from '../../services/PYQService.js';
import { PYQ_STATUS } from '../../models/QuestionPaper.js';

/**
 * ApprovePYQUseCase
 * Delegates domain execution to PYQService.
 */
export class ApprovePYQUseCase {
  constructor(service = pyqService) {
    this.service = service;
  }

  async execute(paperId, adminUser) {
    if (!adminUser || adminUser.role !== 'admin') {
      throw ApiError.forbidden('Only administrators can approve question paper submissions');
    }

    const updatedPaper = await this.service.processAdminReview(
      paperId,
      adminUser,
      PYQ_STATUS.APPROVED
    );

    if (!updatedPaper) {
      throw ApiError.notFound(`Question paper with ID '${paperId}' not found`);
    }

    return {
      success: true,
      message: 'Question paper approved and published for students!',
      data: updatedPaper,
    };
  }
}

export default new ApprovePYQUseCase();
