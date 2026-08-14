import ApiError from '../../utils/ApiError.js';
import bookmarkRepo from '../../repositories/BookmarkRepository.js';

/**
 * BookmarkPYQUseCase
 * Handles student bookmarking / unbookmarking and listing saved papers.
 */
export class BookmarkPYQUseCase {
  constructor(repository = bookmarkRepo) {
    this.repository = repository;
  }

  async toggle(userId, paperId) {
    if (!userId) {
      throw ApiError.unauthorized('User identity required to bookmark paper');
    }
    if (!paperId) {
      throw ApiError.badRequest('Question Paper ID is required');
    }
    const result = await this.repository.toggleBookmark(userId, paperId);
    return { success: true, ...result };
  }

  async getUserBookmarks(userId) {
    if (!userId) {
      throw ApiError.unauthorized('User identity required to view bookmarks');
    }
    const bookmarks = await this.repository.getUserBookmarks(userId);
    return { success: true, count: bookmarks.length, data: bookmarks };
  }
}

export default new BookmarkPYQUseCase();
