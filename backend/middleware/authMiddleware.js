import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { isMongoConnected } from '../config/db.js';

// Valid 24-character hexadecimal ObjectId fallbacks for demo tokens
const MOCK_ADMIN_ID = '65f1a2b3c4d5e6f7a8b9c001';
const MOCK_STUDENT_ID = '65f1a2b3c4d5e6f7a8b9c002';

/**
 * Auth Middleware Class
 * Extracts JWT tokens from Authorization Headers OR HTTP Cookies.
 */
export class AuthMiddleware {
  static protect = async (req, res, next) => {
    let token;

    // 1. Check Authorization Bearer Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check Cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // Gracefully handle unauthenticated guest checks on /auth/me without log clutter
      if (req.originalUrl.includes('/auth/me')) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      return next(ApiError.unauthorized('Not authorized to access this route. Missing token.'));
    }

    try {
      // Demo Admin Bypass
      if (token === 'demo-admin-token') {
        if (isMongoConnected()) {
          const admin =
            (await User.findOne({ email: 'admin@prores.edu' })) ||
            (await User.findOne({ role: 'admin' }));
          if (admin) {
            req.user = admin;
            return next();
          }
        }
        req.user = { _id: MOCK_ADMIN_ID, name: 'System Admin', email: 'admin@prores.edu', role: 'admin' };
        return next();
      }

      // Demo Student Bypass
      if (token === 'demo-student-token') {
        if (isMongoConnected()) {
          const student =
            (await User.findOne({ email: 'student@prores.edu' })) ||
            (await User.findOne({ role: 'student' }));
          if (student) {
            req.user = student;
            return next();
          }
        }
        req.user = { _id: MOCK_STUDENT_ID, name: 'Alex Student', email: 'student@prores.edu', role: 'student' };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pro_res_jwt_secret_key_2026');

      if (isMongoConnected()) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          if (req.originalUrl.includes('/auth/me')) {
            return res.status(401).json({ success: false, message: 'User not found' });
          }
          return next(ApiError.unauthorized('User associated with this token no longer exists.'));
        }
        req.user = user;
      } else {
        req.user = {
          _id: decoded.id && decoded.id.length === 24 ? decoded.id : MOCK_STUDENT_ID,
          name: decoded.name || 'Demo User',
          email: decoded.email || 'user@prores.edu',
          role: decoded.role || 'student',
        };
      }

      next();
    } catch (err) {
      if (req.originalUrl.includes('/auth/me')) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
      }
      return next(ApiError.unauthorized('Token verification failed: Invalid or expired token.'));
    }
  };

  static authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication required before authorization check.'));
      }

      if (!roles.includes(req.user.role)) {
        return next(
          ApiError.forbidden(
            `User role '${req.user.role}' is not authorized to perform this action. Required: [${roles.join(', ')}]`
          )
        );
      }

      next();
    };
  };
}

export const protect = AuthMiddleware.protect;
export const authorize = AuthMiddleware.authorize;
