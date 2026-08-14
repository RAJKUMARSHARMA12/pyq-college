/**
 * Abstract Base Repository (Repository Pattern / SOLID - Open-Closed & Liskov Substitution)
 * Provides generic data access operations for Mongoose models and mock fallbacks.
 */
class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('BaseRepository requires a Mongoose model or data source');
    }
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, populateFields = '') {
    const query = this.model.findById(id);
    if (populateFields) query.populate(populateFields);
    return await query.exec();
  }

  async findOne(filter = {}, populateFields = '') {
    const query = this.model.findOne(filter);
    if (populateFields) query.populate(populateFields);
    return await query.exec();
  }

  async find(filter = {}, populateFields = '', sort = { createdAt: -1 }) {
    const query = this.model.find(filter).sort(sort);
    if (populateFields) query.populate(populateFields);
    return await query.exec();
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

export default BaseRepository;
