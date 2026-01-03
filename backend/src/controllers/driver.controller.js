const driverService = require('../services/driver.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all drivers with pagination
 */
const getAllDrivers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await driverService.getAllDrivers(page, limit);
    return successResponse(res, 200, 'Drivers retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver by ID
 */
const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return successResponse(res, 200, 'Driver retrieved successfully', driver);
  } catch (error) {
    if (error.message === 'Driver not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create driver
 */
const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body);
    return successResponse(res, 201, 'Driver created successfully', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Update driver
 */
const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    return successResponse(res, 200, 'Driver updated successfully', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete driver
 */
const deleteDriver = async (req, res, next) => {
  try {
    await driverService.deleteDriver(req.params.id);
    return successResponse(res, 200, 'Driver deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
