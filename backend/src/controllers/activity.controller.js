const activityService = require('../services/activity.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all activities with pagination
 */
const getAllActivities = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await activityService.getAllActivities(page, limit);
    return successResponse(res, 200, 'Activities retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current driver's activities with pagination
 */
const getMyActivities = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await activityService.getMyActivities(req.user, page, limit);
    return successResponse(res, 200, 'My activities retrieved successfully', result.data, result.pagination);
  } catch (error) {
    if (error.message === 'Driver profile not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Get activity by ID
 */
const getActivityById = async (req, res, next) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    return successResponse(res, 200, 'Activity retrieved successfully', activity);
  } catch (error) {
    if (error.message === 'Activity not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create activity
 */
const createActivity = async (req, res, next) => {
  try {
    const activity = await activityService.createActivity(req.body, req.user);
    return successResponse(res, 201, 'Activity created successfully', activity);
  } catch (error) {
    if (
      error.message === 'Driver profile not found' ||
      error.message === 'Dump truck not found'
    ) {
      return errorResponse(res, 404, error.message);
    }
    if (error.message === 'Number of loads must be a positive number') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

/**
 * Update activity
 */
const updateActivity = async (req, res, next) => {
  try {
    const activity = await activityService.updateActivity(req.params.id, req.body);
    return successResponse(res, 200, 'Activity updated successfully', activity);
  } catch (error) {
    if (error.message === 'Number of loads must be a positive number') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

/**
 * Delete activity
 */
const deleteActivity = async (req, res, next) => {
  try {
    await activityService.deleteActivity(req.params.id);
    return successResponse(res, 200, 'Activity deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllActivities,
  getMyActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
