const scheduleService = require('../services/schedule.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all schedules with pagination and role-based filtering
 */
const getAllSchedules = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await scheduleService.getAllSchedules(req.user.role, req.user.id, page, limit);
    return successResponse(res, 200, 'Schedules retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get schedule by ID
 */
const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    return successResponse(res, 200, 'Schedule retrieved successfully', schedule);
  } catch (error) {
    if (error.message === 'Schedule not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create schedule
 */
const createSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    return successResponse(res, 201, 'Schedule created successfully', schedule);
  } catch (error) {
    if (
      error.message.includes('already assigned') ||
      error.message.includes('must fall within') ||
      error.message.includes('must have')
    ) {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};

/**
 * Update schedule
 */
const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    return successResponse(res, 200, 'Schedule updated successfully', schedule);
  } catch (error) {
    if (
      error.message.includes('already assigned') ||
      error.message.includes('must fall within')
    ) {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};

/**
 * Delete schedule
 */
const deleteSchedule = async (req, res, next) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    return successResponse(res, 200, 'Schedule deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Check availability
 */
const checkAvailability = async (req, res, next) => {
  try {
    const { dumpTruckId, driverId, date, startTime, endTime } = req.query;

    if (!dumpTruckId || !driverId || !date || !startTime || !endTime) {
      return errorResponse(res, 400, 'All parameters are required');
    }

    const result = await scheduleService.checkAvailability(
      dumpTruckId,
      driverId,
      date,
      startTime,
      endTime
    );

    return successResponse(res, 200, 'Availability checked', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  checkAvailability,
};
