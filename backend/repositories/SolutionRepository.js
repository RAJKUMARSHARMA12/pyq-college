import BaseRepository from './BaseRepository.js';
import Solution from '../models/Solution.js';

/**
 * SolutionRepository
 * Encapsulates solution persistence, admin moderation, and upvote management.
 */
class SolutionRepository extends BaseRepository {
  constructor() {
    super(Solution);
  }

  async findApprovedByPaper(paperId) {
    return await this.model
      .find({ questionPaper: paperId, status: 'approved' })
      .populate('uploadedBy', 'name email avatar')
      .sort({ upvotesCount: -1, createdAt: -1 });
  }

  async findPendingSolutions() {
    return await this.model
      .find({ status: 'pending' })
      .populate('questionPaper', 'title academicYear examType')
      .populate('uploadedBy', 'name email avatar')
      .sort({ createdAt: 1 });
  }

  async toggleUpvote(solutionId, userId) {
    const solution = await this.model.findById(solutionId);
    if (!solution) return null;

    const userIndex = solution.upvotedBy.findIndex((id) => id.toString() === userId.toString());

    if (userIndex !== -1) {
      // Remove upvote
      solution.upvotedBy.splice(userIndex, 1);
      solution.upvotesCount = Math.max(0, solution.upvotesCount - 1);
    } else {
      // Add upvote
      solution.upvotedBy.push(userId);
      solution.upvotesCount += 1;
    }

    await solution.save();
    return {
      upvotesCount: solution.upvotesCount,
      hasUpvoted: userIndex === -1,
    };
  }

  async updateSolutionStatus(solutionId, adminId, status, rejectionReason = '') {
    return await this.model.findByIdAndUpdate(
      solutionId,
      {
        status,
        reviewedBy: adminId,
        rejectionReason: status === 'rejected' ? rejectionReason : '',
      },
      { new: true }
    );
  }
}

export default new SolutionRepository();
