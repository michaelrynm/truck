const { z } = require('zod');

const createContractSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().date('Invalid start date format'),
  endDate: z.string().date('Invalid end date format'),
  numberOfTrucks: z.number().int().positive('Number of trucks must be a positive integer'),
  price: z.number().positive('Price must be a positive number'),
  physicalActivityPercentage: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().optional(),
});

const updateContractSchema = z.object({
  clientName: z.string().min(1, 'Client name is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  startDate: z.string().date('Invalid start date format').optional(),
  endDate: z.string().date('Invalid end date format').optional(),
  numberOfTrucks: z.number().int().positive('Number of trucks must be a positive integer').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  physicalActivityPercentage: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().optional(),
});

module.exports = {
  createContractSchema,
  updateContractSchema,
};
