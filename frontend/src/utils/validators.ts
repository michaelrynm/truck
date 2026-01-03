import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User Schemas
const driverInfoSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  phone: z.string().min(1, 'Phone is required'),
});

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'DRIVER']),
  driverInfo: driverInfoSchema.optional(),
}).refine((data) => {
  if (data.role === 'DRIVER') {
    return data.driverInfo !== undefined;
  }
  return true;
}, {
  message: 'Driver info is required when role is DRIVER',
  path: ['driverInfo'],
});

// Driver Schemas
export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  userId: z.string().uuid().optional().nullable(),
});

// Dump Truck Schemas
export const dumpTruckSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1, 'Invalid year'),
  type: z.string().min(1, 'Type is required'),
  capacity: z.number().int().positive('Capacity must be a positive number'),
  status: z.enum(['READY', 'OPERATING', 'MAINTENANCE']),
});

// Contract Schemas
export const contractSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  numberOfTrucks: z.number().int().positive('Number of trucks must be a positive number'),
  price: z.number().positive('Price must be a positive number'),
  physicalActivityPercentage: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().optional(),
});

// Schedule Schemas
export const scheduleSchema = z.object({
  contractId: z.string().uuid('Invalid contract ID'),
  dumpTruckId: z.string().uuid('Invalid dump truck ID'),
  driverId: z.string().uuid('Invalid driver ID'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
});

// Activity Schemas
export const activitySchema = z.object({
  scheduleId: z.string().uuid('Invalid schedule ID'),
  driverId: z.string().uuid('Invalid driver ID'),
  workingHours: z.number().positive('Working hours must be a positive number'),
  notes: z.string().optional(),
});

export const activityLogSchema = z.object({
  dumpTruckId: z.string().uuid('Invalid dump truck ID'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  numberOfLoads: z.number().int().positive('Number of loads must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
});
