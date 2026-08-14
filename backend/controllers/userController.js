import { asyncHandler } from '../middleware/errorMiddleware.js';
import userRepo from '../repositories/UserRepository.js';
import ApiError from '../utils/ApiError.js';
import { isMongoConnected } from '../config/db.js';

// Mock list of users for fallback demo mode when local MongoDB is offline
const mockUsersList = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    name: 'System Admin',
    email: 'admin@prores.edu',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c002',
    name: 'Alex Student',
    email: 'student@prores.edu',
    role: 'student',
    createdAt: new Date(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c003',
    name: 'Sarah Miller',
    email: 'sarah.m@prores.edu',
    role: 'student',
    createdAt: new Date(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c004',
    name: 'David Chen',
    email: 'david.k@prores.edu',
    role: 'student',
    createdAt: new Date(),
  },
];

// @desc    Get All Registered Users (Admin Only)
// @route   GET /api/v1/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    return res.status(200).json({
      success: true,
      count: mockUsersList.length,
      data: mockUsersList,
    });
  }

  const users = await userRepo.findAllUsers();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Update User Role (Promote / Demote) (Admin Only)
// @route   PUT /api/v1/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['student', 'admin'].includes(role)) {
    throw ApiError.badRequest("Role must be 'student' or 'admin'");
  }

  if (!isMongoConnected()) {
    const mock = mockUsersList.find((u) => u._id === id);
    if (mock) mock.role = role;
    return res.status(200).json({
      success: true,
      message: `User role updated to '${role}'`,
      data: mock || { _id: id, role },
    });
  }

  const updatedUser = await userRepo.updateUserRole(id, role);
  if (!updatedUser) {
    throw ApiError.notFound('User account not found');
  }

  res.status(200).json({
    success: true,
    message: `User '${updatedUser.name}' role updated to '${role}'`,
    data: updatedUser,
  });
});

// @desc    Delete User Account (Admin Only)
// @route   DELETE /api/v1/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting their own account
  if (req.user._id.toString() === id.toString()) {
    throw ApiError.badRequest('You cannot delete your own logged-in admin account.');
  }

  if (!isMongoConnected()) {
    const idx = mockUsersList.findIndex((u) => u._id === id);
    if (idx !== -1) mockUsersList.splice(idx, 1);
    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  }

  const deletedUser = await userRepo.deleteUser(id);
  if (!deletedUser) {
    throw ApiError.notFound('User account not found');
  }

  res.status(200).json({
    success: true,
    message: `User account '${deletedUser.email}' deleted successfully`,
  });
});
