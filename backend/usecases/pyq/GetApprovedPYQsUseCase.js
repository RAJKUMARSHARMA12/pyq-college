import questionPaperRepo from '../../repositories/QuestionPaperRepository.js';

/**
 * GetApprovedPYQsUseCase
 * Business Rule: Returns published question papers for students with search and filter capabilities.
 */
export class GetApprovedPYQsUseCase {
  constructor(pyqRepository = questionPaperRepo) {
    this.pyqRepository = pyqRepository;
  }

  async execute({ courseId, subjectId, academicYear, search }) {
    const papers = await this.pyqRepository.findApprovedPapers({
      courseId,
      subjectId,
      academicYear,
      search,
    });

    return {
      success: true,
      count: papers.length,
      data: papers,
    };
  }
}

export default new GetApprovedPYQsUseCase();
