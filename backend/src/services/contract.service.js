const prisma = require('../config/database');
const { isEndDateAfterStartDate } = require('../utils/dateTime.util');
const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

/**
 * Get all contracts with pagination and optional status filter
 */
const getAllContracts = async (status, page, limit) => {
  const where = status ? { status } : {};

  const total = await prisma.contract.count({ where });
  const pagination = calculatePagination(page, limit, total);

  const contracts = await prisma.contract.findMany({
    where,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paginatedResponse(contracts, pagination);
};

/**
 * Get contract by ID
 */
const getContractById = async (id) => {
  const contract = await prisma.contract.findUnique({
    where: { id },
  });

  if (!contract) {
    throw new Error('Contract not found');
  }

  return contract;
};

/**
 * Create contract
 */
const createContract = async (data) => {
  if (!isEndDateAfterStartDate(data.startDate, data.endDate)) {
    throw new Error('End date must be after start date');
  }

  return await prisma.contract.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
};

/**
 * Update contract
 */
const updateContract = async (id, data) => {
  if (data.startDate && data.endDate) {
    if (!isEndDateAfterStartDate(data.startDate, data.endDate)) {
      throw new Error('End date must be after start date');
    }
  }

  const updateData = { ...data };
  if (updateData.startDate) {
    updateData.startDate = new Date(updateData.startDate);
  }
  if (updateData.endDate) {
    updateData.endDate = new Date(updateData.endDate);
  }

  return await prisma.contract.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Delete contract
 */
const deleteContract = async (id) => {
  const activeSchedules = await prisma.schedule.findMany({
    where: {
      contractId: id,
      status: 'SCHEDULED',
    },
  });

  if (activeSchedules.length > 0) {
    throw new Error('Cannot delete contract with active schedules');
  }

  await prisma.schedule.updateMany({
    where: { contractId: id },
    data: { status: 'CANCELLED' },
  });

  return await prisma.contract.delete({
    where: { id },
  });
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
