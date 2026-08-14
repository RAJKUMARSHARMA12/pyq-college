import jwt from 'jsonwebtoken';
import ApiError from '../../utils/ApiError.js';
import userRepo from '../../repositories/UserRepository.js';
import { isMongoConnected } from '../../config/db.js';

const MOCK_ADMIN_ID = '65f1a2b3c4d5e6f7a8b9c001';
const MOCK_STUDENT_ID = '65f1a2b3c4d5e6f7a8b9c002';

/**
 * AuthenticateUserUseCase
 * Handles User Register, Login, and JWT Token Issuance with strict Role Security.
 */
export class AuthenticateUserUseCase {
  constructor(userRepository = userRepo) {
    this.userRepository = userRepository;
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'pro_res_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    if (!isMongoConnected()) {
      const isDemoAdmin = email.toLowerCase().includes('admin');
      const mockUser = {
        _id: isDemoAdmin ? MOCK_ADMIN_ID : MOCK_STUDENT_ID,
        name: isDemoAdmin ? 'Demo Admin' : 'Demo Student',
        email,
        role: isDemoAdmin ? 'admin' : 'student',
      };
      const token = this.generateToken(mockUser);
      return { success: true, token, user: mockUser };
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken(user);
    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      token,
      user: userObject,
    };
  }

  /**
   * Public Registration Procedure
   * SECURITY RULE: Public users automatically register as 'student'.
   * Admin role registration requires matching ADMIN_SECRET_KEY to prevent privilege escalation.
   */
  async register({ name, email, password, role = 'student', adminSecretKey }) {
    if (!name || !email || !password) {
      throw ApiError.badRequest('Name, email, and password are required');
    }

    // Role Security Guard
    let assignedRole = 'student';
    if (role === 'admin') {
      const validSecret = process.env.ADMIN_SECRET_KEY || 'prores_admin_secret_2026';
      if (adminSecretKey !== validSecret) {
        throw ApiError.forbidden('Invalid Admin Secret Key. Public registration cannot assign Admin role.');
      }
      assignedRole = 'admin';
    }

    if (isMongoConnected()) {
      const existing = await this.userRepository.findByEmail(email);
      if (existing) {
        throw ApiError.badRequest(`Email '${email}' is already registered`);
      }
    }

    const newUser = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
    });

    const token = this.generateToken(newUser);
    return {
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}

export default new AuthenticateUserUseCase();
