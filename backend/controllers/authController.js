import { asyncHandler } from '../middleware/errorMiddleware.js';
import authenticateUserUseCase from '../usecases/auth/AuthenticateUserUseCase.js';

const sendTokenResponse = (res, statusCode, result) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', result.token, cookieOptions)
    .json(result);
};

// @desc    Register a new Student or Admin
// @route   POST /api/v1/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const result = await authenticateUserUseCase.register(req.body);
  sendTokenResponse(res, 201, result);
});

// @desc    User Login (Returns JWT Token & Sets HTTP Cookie)
// @route   POST /api/v1/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const result = await authenticateUserUseCase.login(req.body);
  sendTokenResponse(res, 200, result);
});

// @desc    User Logout (Clears HTTP Cookie)
// @route   POST /api/v1/auth/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get Current User Profile
// @route   GET /api/v1/auth/me
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
