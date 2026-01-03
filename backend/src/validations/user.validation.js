const { z } = require('zod');

const driverInfoSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  phone: z.string().min(1, 'Phone is required'),
});

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'DRIVER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, MANAGER, or DRIVER' }),
  }),
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

const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'DRIVER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, MANAGER, or DRIVER' }),
  }).optional(),
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

module.exports = {
  createUserSchema,
  updateUserSchema,
};
