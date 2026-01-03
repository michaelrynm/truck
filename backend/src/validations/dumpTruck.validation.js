const { z } = require('zod');

const createDumpTruckSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1, 'Invalid year'),
  type: z.string().min(1, 'Type is required'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  status: z.enum(['READY', 'OPERATING', 'MAINTENANCE']).optional(),
});

const updateDumpTruckSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required').optional(),
  brand: z.string().min(1, 'Brand is required').optional(),
  model: z.string().min(1, 'Model is required').optional(),
  year: z.number().int().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1, 'Invalid year').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  capacity: z.number().int().positive('Capacity must be a positive integer').optional(),
  status: z.enum(['READY', 'OPERATING', 'MAINTENANCE']).optional(),
});

module.exports = {
  createDumpTruckSchema,
  updateDumpTruckSchema,
};
