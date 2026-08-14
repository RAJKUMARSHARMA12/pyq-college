import jwt from 'jsonwebtoken';
import ApiError from '../../utils/ApiError.js';
import userRepo from '../../repositories/UserRepository.js';
import { isMongoConnected } from '../../config/db.js';

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
      throw ApiError.internal('Database is currently unavailable. Please try again later.');
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

    if (!isMongoConnected()) {
      throw ApiError.internal('Database is currently unavailable. Registration requires an active database connection.');
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

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw ApiError.badRequest(`Email '${email}' is already registered`);
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
