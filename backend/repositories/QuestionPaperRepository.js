import BaseRepository from './BaseRepository.js';
import QuestionPaper, { PYQ_STATUS } from '../models/QuestionPaper.js';

/**
 * QuestionPaperRepository
 * Pure Mongoose Data Access Layer for PYQ operations.
 */
class QuestionPaperRepository extends BaseRepository {
  constructor() {
    super(QuestionPaper);
  }

  async findApprovedPapers({ courseId, subjectId, academicYear, search }) {
    const query = { status: PYQ_STATUS.APPROVED };
    if (courseId && courseId !== 'All') query.course = courseId;
    if (subjectId && subjectId !== 'All') query.subject = subjectId;
    if (academicYear && academicYear !== 'All') query.academicYear = Number(academicYear);
    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }];
    }

    return await this.model
      .find(query)
      .populate('subject', 'name code semester')
      .populate('course', 'name code degree')
      .populate('uploadedBy', 'name email avatar')
      .sort({ academicYear: -1, createdAt: -1 });
  }

  async findPendingPapers() {
    return await this.model
      .find({ status: PYQ_STATUS.PENDING })
      .populate('subject', 'name code semester')
      .populate('course', 'name code degree')
      .populate('uploadedBy', 'name email avatar')
      .sort({ createdAt: 1 });
  }

  async findUserSubmissions(userId) {
    return await this.model
      .find({ uploadedBy: userId })
      .populate('subject', 'name code semester')
      .populate('course', 'name code degree')
      .sort({ createdAt: -1 });
  }

  async updatePaperStatus(paperId, adminId, status, rejectionReason = '') {
    const paper = await this.model.findById(paperId);
    if (!paper) return null;

    if (status === PYQ_STATUS.APPROVED) {
      return await paper.approve(adminId);
    } else {
      return await paper.reject(adminId, rejectionReason);
    }
  }

  async incrementViews(paperId) {
    return await this.model.findByIdAndUpdate(
      paperId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
  }

  async incrementDownloads(paperId) {
    return await this.model.findByIdAndUpdate(
      paperId,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
  }

  async createPaper(data) {
    return await this.create({
      ...data,
      status: PYQ_STATUS.PENDING,
      viewsCount: 0,
      downloadsCount: 0,
    });
  }
}

export default new QuestionPaperRepository();
