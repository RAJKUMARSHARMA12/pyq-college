import BaseRepository from './BaseRepository.js';
import Course from '../models/Course.js';

/**
 * CourseRepository
 * Handles academic course persistence operations.
 */
class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }

  async findByCode(code) {
    return await this.model.findOne({ code: code.toUpperCase() });
  }
}

export default new CourseRepository();
