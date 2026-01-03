const prisma = require('../config/database');
const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

/**
 * Get all activities with pagination
 */
const getAllActivities = async (page, limit) => {
  const total = await prisma.activityLog.count();
  const pagination = calculatePagination(page, limit, total);

  const activities = await prisma.activityLog.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
      dumpTruck: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return paginatedResponse(activities, pagination);
};

/**
 * Get activities for current driver with pagination
 */
const getMyActivities = async (currentUser, page, limit) => {
  const driver = await prisma.driver.findFirst({
    where: { userId: currentUser.id },
  });

  if (!driver) {
    throw new Error('Driver profile not found');
  }

  const where = { driverId: driver.id };
  const total = await prisma.activityLog.count({ where });
  const pagination = calculatePagination(page, limit, total);

  const activities = await prisma.activityLog.findMany({
    where,
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
      dumpTruck: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return paginatedResponse(activities, pagination);
};

/**
 * Get activity by ID
 */
const getActivityById = async (id) => {
  const activity = await prisma.activityLog.findUnique({
    where: { id },
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
      dumpTruck: true,
    },
  });

  if (!activity) {
    throw new Error('Activity not found');
  }

  return activity;
};

/**
 * Create activity
 */
const createActivity = async (data, currentUser) => {
  // Auto-fill driverId for DRIVER role
  let driverId = data.driverId;
  if (currentUser.role === 'DRIVER') {
    const driver = await prisma.driver.findFirst({
      where: { userId: currentUser.id },
    });

    if (!driver) {
      throw new Error('Driver profile not found');
    }

    driverId = driver.id;
  }

  // Validate number of loads
  if (data.numberOfLoads <= 0) {
    throw new Error('Number of loads must be a positive number');
  }

  // Verify dump truck exists
  const dumpTruck = await prisma.dumpTruck.findUnique({
    where: { id: data.dumpTruckId },
  });

  if (!dumpTruck) {
    throw new Error('Dump truck not found');
  }

  const activity = await prisma.activityLog.create({
    data: {
      ...data,
      driverId,
      date: new Date(data.date),
    },
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
      dumpTruck: true,
    },
  });

  return activity;
};

/**
 * Update activity
 */
const updateActivity = async (id, data) => {
  if (data.numberOfLoads !== undefined && data.numberOfLoads <= 0) {
    throw new Error('Number of loads must be a positive number');
  }

  // Convert date string to Date if provided
  if (data.date) {
    data.date = new Date(data.date);
  }

  return await prisma.activityLog.update({
    where: { id },
    data,
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
      dumpTruck: true,
    },
  });
};

/**
 * Delete activity
 */
const deleteActivity = async (id) => {
  return await prisma.activityLog.delete({
    where: { id },
  });
};

module.exports = {
  getAllActivities,
  getMyActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
