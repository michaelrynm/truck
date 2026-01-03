const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all users with pagination
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userService.getAllUsers(page, limit);
    return successResponse(res, 200, 'Users retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create user
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 201, 'User created successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    if (error.message === 'Cannot delete user linked to driver with active schedules') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
