import ApiError from '../utils/ApiError.js';

/**
 * Higher-Order Function: Async Controller Wrapper
 * Eliminates boiler-plate try-catch blocks in controller handlers (DRY & SOLID).
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Not Found Middleware Handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Resource not found - ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], false, error.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  // Only log operational/server errors, suppress 401 unauthenticated guest checks
  if (process.env.NODE_ENV === 'development' && error.statusCode !== 401) {
    console.error(`❌ [Error Handler] ${req.method} ${req.originalUrl}:`, error);
  }

  res.status(error.statusCode).json(response);
};
