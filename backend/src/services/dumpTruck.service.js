const prisma = require('../config/database');
const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

/**
 * Get all dump trucks with pagination
 */
const getAllDumpTrucks = async (page, limit) => {
  const total = await prisma.dumpTruck.count();
  const pagination = calculatePagination(page, limit, total);

  const dumpTrucks = await prisma.dumpTruck.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paginatedResponse(dumpTrucks, pagination);
};

/**
 * Get dump truck by ID
 */
const getDumpTruckById = async (id) => {
  const dumpTruck = await prisma.dumpTruck.findUnique({
    where: { id },
  });

  if (!dumpTruck) {
    throw new Error('Dump truck not found');
  }

  return dumpTruck;
};

/**
 * Create dump truck
 */
const createDumpTruck = async (data) => {
  return await prisma.dumpTruck.create({
    data,
  });
};

/**
 * Update dump truck
 */
const updateDumpTruck = async (id, data) => {
  return await prisma.dumpTruck.update({
    where: { id },
    data,
  });
};

/**
 * Delete dump truck
 */
const deleteDumpTruck = async (id) => {
  return await prisma.dumpTruck.delete({
    where: { id },
  });
};

module.exports = {
  getAllDumpTrucks,
  getDumpTruckById,
  createDumpTruck,
  updateDumpTruck,
  deleteDumpTruck,
};
