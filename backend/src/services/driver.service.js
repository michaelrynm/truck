const prisma = require('../config/database');
const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

/**
 * Get all drivers with pagination
 */
const getAllDrivers = async (page, limit) => {
  const total = await prisma.driver.count();
  const pagination = calculatePagination(page, limit, total);

  const drivers = await prisma.driver.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paginatedResponse(drivers, pagination);
};

/**
 * Get driver by ID
 */
const getDriverById = async (id) => {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!driver) {
    throw new Error('Driver not found');
  }

  return driver;
};

/**
 * Create driver
 */
const createDriver = async (data) => {
  return await prisma.driver.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Update driver
 */
const updateDriver = async (id, data) => {
  return await prisma.driver.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Delete driver
 */
const deleteDriver = async (id) => {
  return await prisma.driver.delete({
    where: { id },
  });
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
