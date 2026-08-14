import questionPaperRepo from '../../repositories/QuestionPaperRepository.js';
import QuestionPaper, { PYQ_STATUS } from '../../models/QuestionPaper.js';

/**
 * GetAdminStatsUseCase
 * Pure Mongoose Aggregation Query for Admin Moderation Analytics.
 */
export class GetAdminStatsUseCase {
  constructor(pyqRepository = questionPaperRepo) {
    this.pyqRepository = pyqRepository;
  }

  async execute() {
    const totalPapers = await QuestionPaper.countDocuments();
    const pendingReview = await QuestionPaper.countDocuments({ status: PYQ_STATUS.PENDING });
    const approvedCount = await QuestionPaper.countDocuments({ status: PYQ_STATUS.APPROVED });
    const rejectedCount = await QuestionPaper.countDocuments({ status: PYQ_STATUS.REJECTED });

    const statsAgg = await QuestionPaper.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewsCount' },
          totalDownloads: { $sum: '$downloadsCount' },
        },
      },
    ]);

    const totalViews = statsAgg[0]?.totalViews || 0;
    const totalDownloads = statsAgg[0]?.totalDownloads || 0;

    return {
      success: true,
      data: {
        totalPapers,
        pendingReview,
        approvedCount,
        rejectedCount,
        totalViews,
        totalDownloads,
      },
    };
  }
}

export default new GetAdminStatsUseCase();
