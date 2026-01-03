export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  DRIVER: 'DRIVER',
} as const;

export const ROLE_LABELS = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  DRIVER: 'Driver',
} as const;

export const DRIVER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const TRUCK_STATUS = {
  READY: 'READY',
  OPERATING: 'OPERATING',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const SCHEDULE_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const STATUS_COLORS = {
  // Driver Status
  ACTIVE: 'bg-green-900/10 text-green-800 border-green-800/20',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-300',

  // Truck Status
  READY: 'bg-green-900/10 text-green-800 border-green-800/20',
  OPERATING: 'bg-blue-900/10 text-blue-800 border-blue-800/20',
  MAINTENANCE: 'bg-orange-900/10 text-orange-800 border-orange-800/20',

  // Contract/Schedule Status
  SCHEDULED: 'bg-blue-900/10 text-blue-800 border-blue-800/20',
  COMPLETED: 'bg-green-900/10 text-green-800 border-green-800/20',
  CANCELLED: 'bg-red-900/10 text-red-800 border-red-800/20',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Dump Truck Management System';
