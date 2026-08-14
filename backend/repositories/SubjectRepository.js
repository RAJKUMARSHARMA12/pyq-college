import BaseRepository from './BaseRepository.js';
import Subject from '../models/Subject.js';

/**
 * SubjectRepository
 * Handles curriculum subject persistence operations.
 */
class SubjectRepository extends BaseRepository {
  constructor() {
    super(Subject);
  }

  async findByCourseAndSemester(courseId, semester) {
    const filter = {};
    if (courseId) filter.course = courseId;
    if (semester) filter.semester = Number(semester);
    return await this.model.find(filter).populate('course', 'name code degree').sort({ name: 1 });
  }

  async findByCode(code) {
    return await this.model.findOne({ code: code.toUpperCase() }).populate('course');
  }
}

export default new SubjectRepository();
