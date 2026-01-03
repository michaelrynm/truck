// User & Auth Types
export type Role = 'ADMIN' | 'MANAGER' | 'DRIVER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  driver?: {
    id: string;
    licenseNumber: string;
    phone: string;
    status: DriverStatus;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Driver Types
export type DriverStatus = 'ACTIVE' | 'INACTIVE';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  address?: string | null;
  status: DriverStatus;
  userId?: string | null;
  user?: User | null;
  createdAt: string;
  updatedAt: string;
}

// Dump Truck Types
export type TruckStatus = 'READY' | 'OPERATING' | 'MAINTENANCE';

export interface DumpTruck {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  status: TruckStatus;
  createdAt: string;
  updatedAt: string;
}

// Contract Types
export type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Contract {
  id: string;
  clientName: string;
  location: string;
  startDate: string;
  endDate: string;
  numberOfTrucks: number;
  price: number;
  physicalActivityPercentage?: number | null;
  status: ContractStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Schedule Types
export type ScheduleStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Schedule {
  id: string;
  contractId: string;
  dumpTruckId: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  contract?: Contract;
  dumpTruck?: DumpTruck;
  driver?: Driver;
  createdAt: string;
  updatedAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  driverId: string;
  dumpTruckId?: string;
  scheduleId?: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  numberOfLoads: number;
  location: string;
  workingHours?: number;
  notes?: string | null;
  submittedAt?: string;
  schedule?: Schedule;
  driver?: Driver;
  dumpTruck?: DumpTruck;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface OperationsReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalHours: number;
    totalActivities: number;
  };
  contractSummary: Record<string, {
    totalHours: number;
    totalActivities: number;
  }>;
  activities: ActivityLog[];
}

export interface EfficiencyReport {
  truckId: string;
  plateNumber: string;
  type: string;
  status: TruckStatus;
  totalSchedules: number;
  totalHours: number;
  averageHoursPerSchedule: number;
}

export interface DriverReport {
  driverId: string;
  driverName: string;
  totalSchedules: number;
  completedSchedules: number;
  totalLoads: number;
}

export interface ContractReport {
  contractId: string;
  clientName: string;
  location: string;
  totalSchedules: number;
  completedSchedules: number;
  totalLoads: number;
}

// Pagination Types
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMetadata;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// Form Input Types
export interface UserFormData {
  email: string;
  password?: string;
  name: string;
  role: Role;
  driverInfo?: {
    licenseNumber: string;
    phone: string;
  };
}

export interface DriverFormData {
  name: string;
  licenseNumber: string;
  phone: string;
  address?: string;
  status: DriverStatus;
  userId?: string | null;
}

export interface DumpTruckFormData {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  status: TruckStatus;
}

export interface ContractFormData {
  clientName: string;
  location: string;
  startDate: string;
  endDate: string;
  numberOfTrucks: number;
  price: number;
  physicalActivityPercentage?: number;
  status?: ContractStatus;
  description?: string;
}

export interface ScheduleFormData {
  contractId: string;
  dumpTruckId: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: ScheduleStatus;
}

export interface ActivityFormData {
  scheduleId: string;
  driverId: string;
  workingHours: number;
  notes?: string;
}

export interface ActivityLogFormData {
  dumpTruckId: string;
  date: string;
  startTime: string;
  endTime?: string;
  numberOfLoads: number;
  location: string;
  notes?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Filter Types
export interface ContractFilters {
  status?: ContractStatus;
}

export interface DumpTruckFilters {
  status?: TruckStatus;
}

export interface DriverFilters {
  status?: DriverStatus;
}
