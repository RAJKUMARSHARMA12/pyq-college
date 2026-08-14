import questionPaperRepo from '../repositories/QuestionPaperRepository.js';
import notificationService from './NotificationService.js';
import storageService from './StorageService.js';
import { PYQ_STATUS } from '../models/QuestionPaper.js';

/**
 * High-Level Domain Service for Previous Year Question Operations
 * Integrates Repositories, Storage, and Notification Services.
 */
export class PYQService {
  constructor(
    repo = questionPaperRepo,
    notifier = notificationService,
    storage = storageService
  ) {
    this.repo = repo;
    this.notifier = notifier;
    this.storage = storage;
  }

  async processStudentUpload(uploadData, studentUser) {
    const formattedData = {
      ...uploadData,
      fileUrl: this.storage.getFilePublicUrl(uploadData.fileUrl),
      solutionUrl: uploadData.solutionUrl ? this.storage.getFilePublicUrl(uploadData.solutionUrl) : '',
      uploadedBy: studentUser._id || studentUser.id,
      status: PYQ_STATUS.PENDING,
    };

    const createdPaper = await this.repo.createPaper(formattedData);

    // Trigger Admin Alert
    await this.notifier.notifyAdminsOnNewSubmission(createdPaper, studentUser);

    return createdPaper;
  }

  async processAdminReview(paperId, adminUser, status, rejectionReason = '') {
    const updatedPaper = await this.repo.updatePaperStatus(
      paperId,
      adminUser._id || adminUser.id,
      status,
      rejectionReason
    );

    if (updatedPaper) {
      // Send Student Notification
      await this.notifier.notifyStudentOnStatusChange(updatedPaper, status, rejectionReason);
    }

    return updatedPaper;
  }

  async getPublishedCatalog(filters) {
    return await this.repo.findApprovedPapers(filters);
  }
}

export default new PYQService();
