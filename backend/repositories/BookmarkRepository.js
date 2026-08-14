import BaseRepository from './BaseRepository.js';
import Bookmark from '../models/Bookmark.js';

/**
 * BookmarkRepository
 * Pure Mongoose Database Queries for user bookmarks.
 */
class BookmarkRepository extends BaseRepository {
  constructor() {
    super(Bookmark);
  }

  async toggleBookmark(userId, paperId) {
    const existing = await this.model.findOne({ user: userId, questionPaper: paperId });
    if (existing) {
      await this.model.findByIdAndDelete(existing._id);
      return { isBookmarked: false, message: 'Bookmark removed' };
    }

    await this.model.create({ user: userId, questionPaper: paperId });
    return { isBookmarked: true, message: 'Paper bookmarked successfully' };
  }

  async getUserBookmarks(userId) {
    return await this.model
      .find({ user: userId })
      .populate({
        path: 'questionPaper',
        populate: ['subject', 'course'],
      })
      .sort({ createdAt: -1 });
  }
}

export default new BookmarkRepository();
