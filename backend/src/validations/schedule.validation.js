const { z } = require('zod');

const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const createScheduleSchema = z.object({
  contractId: z.string().uuid('Invalid contract ID'),
  dumpTruckId: z.string().uuid('Invalid dump truck ID'),
  driverId: z.string().uuid('Invalid driver ID'),
  date: z.string().date('Invalid date format'),
  startTime: z.string().regex(timeFormatRegex, 'Start time must be in HH:mm format'),
  endTime: z.string().regex(timeFormatRegex, 'End time must be in HH:mm format'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
});

const updateScheduleSchema = z.object({
  contractId: z.string().uuid('Invalid contract ID').optional(),
  dumpTruckId: z.string().uuid('Invalid dump truck ID').optional(),
  driverId: z.string().uuid('Invalid driver ID').optional(),
  date: z.string().date('Invalid date format').optional(),
  startTime: z.string().regex(timeFormatRegex, 'Start time must be in HH:mm format').optional(),
  endTime: z.string().regex(timeFormatRegex, 'End time must be in HH:mm format').optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
});

module.exports = {
  createScheduleSchema,
  updateScheduleSchema,
};
