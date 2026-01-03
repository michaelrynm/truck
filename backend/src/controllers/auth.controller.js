const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 200, 'Login successful', {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 200, 'Logout successful');
};

/**
 * Refresh token
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return errorResponse(res, 401, 'Refresh token is required');
    }

    const result = await authService.refresh(refreshToken);

    return successResponse(res, 200, 'Token refreshed', {
      accessToken: result.accessToken,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 404, error.message);
    }
    return errorResponse(res, 401, 'Invalid refresh token');
  }
};

/**
 * Get current user
 */
const me = async (req, res) => {
  return successResponse(res, 200, 'User retrieved', req.user);
};

module.exports = {
  login,
  logout,
  refresh,
  me,
};
