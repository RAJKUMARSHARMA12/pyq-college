import Item from '../models/Item.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get all items
// @route   GET /api/items
export const getItems = asyncHandler(async (req, res) => {
  const { search, category, status } = req.query;

  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category && category !== 'All') {
    query.category = category;
  }
  if (status && status !== 'All') {
    query.status = status;
  }
  const items = await Item.find(query).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, count: items.length, data: items });
});

// @desc    Get single item by ID
// @route   GET /api/items/:id
export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  return res.status(200).json({ success: true, data: item });
});

// @desc    Create new item
// @route   POST /api/items
export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, status, priority, tags } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newItem = await Item.create({
    title,
    description,
    category: category || 'General',
    status: status || 'Active',
    priority: priority || 'Medium',
    tags: Array.isArray(tags) ? tags : [],
  });
  return res.status(201).json({ success: true, data: newItem });
});

// @desc    Update item
// @route   PUT /api/items/:id
export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedItem) return res.status(404).json({ success: false, message: 'Item not found' });
  return res.status(200).json({ success: true, data: updatedItem });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  return res.status(200).json({ success: true, message: 'Item deleted' });
});
