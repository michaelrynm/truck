const contractService = require('../services/contract.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get all contracts with pagination and optional status filter
 */
const getAllContracts = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await contractService.getAllContracts(status, page, limit);
    return successResponse(res, 200, 'Contracts retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get contract by ID
 */
const getContractById = async (req, res, next) => {
  try {
    const contract = await contractService.getContractById(req.params.id);
    return successResponse(res, 200, 'Contract retrieved successfully', contract);
  } catch (error) {
    if (error.message === 'Contract not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Create contract
 */
const createContract = async (req, res, next) => {
  try {
    const contract = await contractService.createContract(req.body);
    return successResponse(res, 201, 'Contract created successfully', contract);
  } catch (error) {
    if (error.message === 'End date must be after start date') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

/**
 * Update contract
 */
const updateContract = async (req, res, next) => {
  try {
    const contract = await contractService.updateContract(req.params.id, req.body);
    return successResponse(res, 200, 'Contract updated successfully', contract);
  } catch (error) {
    if (error.message === 'End date must be after start date') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

/**
 * Delete contract
 */
const deleteContract = async (req, res, next) => {
  try {
    await contractService.deleteContract(req.params.id);
    return successResponse(res, 200, 'Contract deleted successfully');
  } catch (error) {
    if (error.message === 'Cannot delete contract with active schedules') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
