const { z } = require('zod');

const createActivitySchema = z.object({
  scheduleId: z.string().uuid('Invalid schedule ID').optional(),
  dumpTruckId: z.string().uuid('Invalid dump truck ID'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  numberOfLoads: z.number().int().positive('Number of loads must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  workingHours: z.number().positive('Working hours must be a positive number').optional(),
  notes: z.string().optional(),
});

const updateActivitySchema = z.object({
  scheduleId: z.string().uuid('Invalid schedule ID').optional(),
  dumpTruckId: z.string().uuid('Invalid dump truck ID').optional(),
  date: z.string().min(1, 'Date is required').optional(),
  startTime: z.string().min(1, 'Start time is required').optional(),
  endTime: z.string().optional(),
  numberOfLoads: z.number().int().positive('Number of loads must be a positive number').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  workingHours: z.number().positive('Working hours must be a positive number').optional(),
  notes: z.string().optional(),
});

module.exports = {
  createActivitySchema,
  updateActivitySchema,
};
