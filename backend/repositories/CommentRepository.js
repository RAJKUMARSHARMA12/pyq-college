import BaseRepository from './BaseRepository.js';
import Comment from '../models/Comment.js';

/**
 * CommentRepository
 * Handles question paper Q&A discussion persistence.
 */
class CommentRepository extends BaseRepository {
  constructor() {
    super(Comment);
  }

  async findByPaper(paperId) {
    return await this.model
      .find({ questionPaper: paperId })
      .populate('user', 'name email role avatar')
      .sort({ createdAt: -1 });
  }

  async addComment(paperId, userId, content) {
    const comment = await this.model.create({
      questionPaper: paperId,
      user: userId,
      content,
    });

    return await comment.populate('user', 'name email role avatar');
  }
}

export default new CommentRepository();
