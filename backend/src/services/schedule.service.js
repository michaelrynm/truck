const prisma = require('../config/database');
const { isDateInRange, doTimeRangesOverlap } = require('../utils/dateTime.util');

/**
 * Check availability of truck and driver
 */
const checkAvailability = async (dumpTruckId, driverId, date, startTime, endTime, excludeScheduleId = null) => {
  const scheduleDate = new Date(date);
  scheduleDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(scheduleDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const where = {
    date: {
      gte: scheduleDate,
      lt: nextDay,
    },
    status: {
      in: ['SCHEDULED', 'COMPLETED'],
    },
  };

  if (excludeScheduleId) {
    where.id = { not: excludeScheduleId };
  }

  const truckSchedules = await prisma.schedule.findMany({
    where: {
      ...where,
      dumpTruckId,
    },
  });

  for (const schedule of truckSchedules) {
    if (doTimeRangesOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
      return {
        available: false,
        message: 'Dump truck is already assigned to another schedule during this time',
      };
    }
  }

  const driverSchedules = await prisma.schedule.findMany({
    where: {
      ...where,
      driverId,
    },
  });

  for (const schedule of driverSchedules) {
    if (doTimeRangesOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
      return {
        available: false,
        message: 'Driver is already assigned to another schedule during this time',
      };
    }
  }

  return { available: true };
};

/**
 * Get all schedules with pagination and role-based filtering
 */
const getAllSchedules = async (userRole, userId, page, limit) => {
  const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

  let where = {};

  if (userRole === 'DRIVER') {
    const driver = await prisma.driver.findFirst({
      where: { userId },
    });

    if (!driver) {
      return paginatedResponse([], { page: 1, limit: 10, skip: 0, total: 0, totalPages: 0 });
    }

    where = { driverId: driver.id };
  }

  const total = await prisma.schedule.count({ where });
  const pagination = calculatePagination(page, limit, total);

  const schedules = await prisma.schedule.findMany({
    where,
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      contract: true,
      dumpTruck: true,
      driver: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paginatedResponse(schedules, pagination);
};

/**
 * Get schedule by ID
 */
const getScheduleById = async (id) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      contract: true,
      dumpTruck: true,
      driver: true,
    },
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  return schedule;
};

/**
 * Create schedule
 */
const createSchedule = async (data) => {
  const contract = await prisma.contract.findUnique({
    where: { id: data.contractId },
  });

  if (!contract) {
    throw new Error('Contract not found');
  }

  if (!isDateInRange(data.date, contract.startDate, contract.endDate)) {
    throw new Error('Schedule date must fall within contract period');
  }

  const dumpTruck = await prisma.dumpTruck.findUnique({
    where: { id: data.dumpTruckId },
  });

  if (!dumpTruck || dumpTruck.status !== 'READY') {
    throw new Error('Dump truck must have READY status');
  }

  const driver = await prisma.driver.findUnique({
    where: { id: data.driverId },
  });

  if (!driver || driver.status !== 'ACTIVE') {
    throw new Error('Driver must have ACTIVE status');
  }

  const availability = await checkAvailability(
    data.dumpTruckId,
    data.driverId,
    data.date,
    data.startTime,
    data.endTime
  );

  if (!availability.available) {
    throw new Error(availability.message);
  }

  await prisma.dumpTruck.update({
    where: { id: data.dumpTruckId },
    data: { status: 'OPERATING' },
  });

  return await prisma.schedule.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
    include: {
      contract: true,
      dumpTruck: true,
      driver: true,
    },
  });
};

/**
 * Update schedule
 */
const updateSchedule = async (id, data) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  if (data.contractId) {
    const contract = await prisma.contract.findUnique({
      where: { id: data.contractId },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    const scheduleDate = data.date ? new Date(data.date) : schedule.date;
    if (!isDateInRange(scheduleDate, contract.startDate, contract.endDate)) {
      throw new Error('Schedule date must fall within contract period');
    }
  }

  if (data.dumpTruckId || data.driverId || data.date || data.startTime || data.endTime) {
    const availability = await checkAvailability(
      data.dumpTruckId || schedule.dumpTruckId,
      data.driverId || schedule.driverId,
      data.date || schedule.date,
      data.startTime || schedule.startTime,
      data.endTime || schedule.endTime,
      id
    );

    if (!availability.available) {
      throw new Error(availability.message);
    }
  }

  const updateData = { ...data };
  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }

  return await prisma.schedule.update({
    where: { id },
    data: updateData,
    include: {
      contract: true,
      dumpTruck: true,
      driver: true,
    },
  });
};

/**
 * Delete schedule
 */
const deleteSchedule = async (id) => {
  return await prisma.schedule.delete({
    where: { id },
  });
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  checkAvailability,
};
