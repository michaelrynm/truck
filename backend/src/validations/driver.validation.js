const { z } = require('zod');

const createDriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  userId: z.string().uuid('Invalid user ID').optional().nullable(),
});

const updateDriverSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  licenseNumber: z.string().min(1, 'License number is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  userId: z.string().uuid('Invalid user ID').optional().nullable(),
});

module.exports = {
  createDriverSchema,
  updateDriverSchema,
};
