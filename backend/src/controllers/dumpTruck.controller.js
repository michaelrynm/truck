const dumpTruckService = require('../services/dumpTruck.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all dump trucks with pagination
 */
const getAllDumpTrucks = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await dumpTruckService.getAllDumpTrucks(page, limit);
    return successResponse(res, 200, 'Dump trucks retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get dump truck by ID
 */
const getDumpTruckById = async (req, res, next) => {
  try {
    const dumpTruck = await dumpTruckService.getDumpTruckById(req.params.id);
    return successResponse(res, 200, 'Dump truck retrieved successfully', dumpTruck);
  } catch (error) {
    if (error.message === 'Dump truck not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create dump truck
 */
const createDumpTruck = async (req, res, next) => {
  try {
    const dumpTruck = await dumpTruckService.createDumpTruck(req.body);
    return successResponse(res, 201, 'Dump truck created successfully', dumpTruck);
  } catch (error) {
    next(error);
  }
};

/**
 * Update dump truck
 */
const updateDumpTruck = async (req, res, next) => {
  try {
    const dumpTruck = await dumpTruckService.updateDumpTruck(req.params.id, req.body);
    return successResponse(res, 200, 'Dump truck updated successfully', dumpTruck);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete dump truck
 */
const deleteDumpTruck = async (req, res, next) => {
  try {
    await dumpTruckService.deleteDumpTruck(req.params.id);
    return successResponse(res, 200, 'Dump truck deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDumpTrucks,
  getDumpTruckById,
  createDumpTruck,
  updateDumpTruck,
  deleteDumpTruck,
};
