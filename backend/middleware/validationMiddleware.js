import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

/**
 * Validation Middleware Utilities
 */
export class ValidationMiddleware {
  /**
   * Validates if route parameter (e.g. req.params.id) is a valid MongoDB ObjectId or valid string ID
   */
  static validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
      const id = req.params[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id) && !id.startsWith('pyq_') && id !== '1' && id !== '2' && id !== '3') {
        return next(ApiError.badRequest(`Invalid resource ID format: '${id}'`));
      }
      next();
    };
  };

  /**
   * Validates Question Paper creation payload
   */
  static validatePYQInput = (req, res, next) => {
    const { title, academicYear } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Title is required');
    }

    if (academicYear) {
      const year = Number(academicYear);
      if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1) {
        errors.push(`Academic year must be a valid number between 2000 and ${new Date().getFullYear() + 1}`);
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation Failed', errors));
    }

    next();
  };
}

export const validateObjectId = ValidationMiddleware.validateObjectId;
export const validatePYQInput = ValidationMiddleware.validatePYQInput;
