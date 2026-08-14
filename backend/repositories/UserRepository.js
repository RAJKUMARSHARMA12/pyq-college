import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

/**
 * UserRepository
 * Handles user persistence, admin operations, and role management.
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findAdmins() {
    return await this.model.find({ role: 'admin' }).select('-password');
  }

  async findAllUsers() {
    return await this.model.find({}).select('-password').sort({ createdAt: -1 });
  }

  async updateUserRole(userId, newRole) {
    return await this.model
      .findByIdAndUpdate(userId, { role: newRole }, { new: true, runValidators: true })
      .select('-password');
  }

  async deleteUser(userId) {
    return await this.model.findByIdAndDelete(userId);
  }
}

export default new UserRepository();
