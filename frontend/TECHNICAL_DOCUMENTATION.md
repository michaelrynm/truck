# Dump Truck Management System - Frontend Technical Documentation

> **Version:** 1.0.0
> **Last Updated:** January 2026
> **Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Getting Started](#2-getting-started)
3. [Architecture](#3-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Components](#5-components)
6. [Pages](#6-pages)
7. [API Integration](#7-api-integration)
8. [State Management](#8-state-management)
9. [Routing & Navigation](#9-routing--navigation)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Form Handling & Validation](#11-form-handling--validation)
12. [Utilities & Helpers](#12-utilities--helpers)
13. [Styling Guide](#13-styling-guide)
14. [Environment Configuration](#14-environment-configuration)
15. [Error Handling](#15-error-handling)
16. [Testing](#16-testing)
17. [Build & Deployment](#17-build--deployment)
18. [Troubleshooting](#18-troubleshooting)
19. [Contributing Guidelines](#19-contributing-guidelines)
20. [Changelog](#20-changelog)

---

## 1. Project Overview

### 1.1 Description

Dump Truck Management System adalah aplikasi web untuk mengelola operasional dump truck, termasuk manajemen driver, truk, kontrak, jadwal, dan pelaporan aktivitas.

### 1.2 Key Features

| Feature | Description |
|---------|-------------|
| User Management | CRUD operations untuk admin, manager, dan driver |
| Truck Management | Kelola informasi dan status dump truck |
| Contract Management | Kelola kontrak dengan klien |
| Schedule Management | Penjadwalan truk dan driver |
| Activity Logging | Pencatatan aktivitas harian driver |
| Reports | Laporan operasional, efisiensi, dan performa |

### 1.3 User Roles

| Role | Access Level |
|------|--------------|
| **Admin** | Full access ke semua fitur |
| **Manager** | Manage trucks, contracts, schedules, view reports |
| **Driver** | View schedule, log activities, view profile |

### 1.4 Tech Stack

```
Frontend Framework  : React 18.2.0
Language           : TypeScript 5.2.2
Build Tool         : Vite 5.0.8
Styling            : Tailwind CSS 3.4.0
State Management   : TanStack React Query 5.14.2
Form Handling      : React Hook Form 7.49.2
Validation         : Zod 3.22.4
HTTP Client        : Axios 1.6.2
Routing            : React Router DOM 6.21.0
Icons              : Lucide React 0.303.0
Date Formatting    : date-fns 3.0.6
Notifications      : React Hot Toast 2.4.1
```

---

## 2. Getting Started

### 2.1 Prerequisites

- Node.js >= 18.x
- npm >= 9.x atau yarn >= 1.22.x
- Backend API running di `http://localhost:8000`

### 2.2 Installation

```bash
# Clone repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### 2.3 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### 2.4 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Manager | manager@example.com | password123 |
| Driver | driver@example.com | password123 |

---

## 3. Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│                     React Application                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │  Components │  │   Layouts           │  │
│  │  (Views)    │  │  (Reusable) │  │  (Structure)        │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │                    React Query                          │ │
│  │              (Server State Management)                  │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────────┐ │
│  │                    API Layer (Axios)                     │ │
│  └────────────────────────┬────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP/HTTPS
┌───────────────────────────┴─────────────────────────────────┐
│                     Backend API Server                       │
│                   (http://localhost:8000)                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

```
User Action → Component → React Query Hook → API Layer → Backend
                                    ↓
                              Cache Update
                                    ↓
                            Component Re-render
```

### 3.3 Design Patterns

| Pattern | Implementation |
|---------|----------------|
| **Component Composition** | Reusable components di `/components/common` |
| **Container/Presentational** | Pages sebagai containers, Components sebagai presentational |
| **Custom Hooks** | `useAuth()` untuk authentication state |
| **Context API** | `AuthContext` untuk global auth state |
| **Repository Pattern** | API modules di `/api` folder |

---

## 4. Folder Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API integration layer
│   │   ├── axios.ts             # Axios instance & interceptors
│   │   ├── auth.api.ts          # Authentication endpoints
│   │   ├── users.api.ts         # User management endpoints
│   │   ├── drivers.api.ts       # Driver endpoints
│   │   ├── dumpTrucks.api.ts    # Truck endpoints
│   │   ├── contracts.api.ts     # Contract endpoints
│   │   ├── schedules.api.ts     # Schedule endpoints
│   │   ├── activities.api.ts    # Activity endpoints
│   │   └── reports.api.ts       # Report endpoints
│   │
│   ├── components/
│   │   └── common/              # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Card.tsx
│   │       ├── Table.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── Pagination.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── features/
│   │   └── auth/                # Authentication feature
│   │       ├── AuthContext.tsx
│   │       └── AuthProvider.tsx
│   │
│   ├── layouts/                 # Page layouts
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   │
│   ├── pages/                   # Page components
│   │   ├── LoginPage.tsx
│   │   ├── admin/               # Admin pages
│   │   ├── manager/             # Manager pages
│   │   └── driver/              # Driver pages
│   │
│   ├── routes/                  # Routing configuration
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleRoute.tsx
│   │
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── .env.example                 # Environment template
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

---

## 5. Components

### 5.1 Component Overview

Semua reusable components berada di `src/components/common/`.

### 5.2 Button Component

**Path:** `src/components/common/Button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  // + standard button attributes
}
```

**Usage:**

```tsx
// Primary button
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>

// Loading state
<Button isLoading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>

// Danger button
<Button variant="danger" size="sm" onClick={handleDelete}>
  Delete
</Button>
```

### 5.3 Input Component

**Path:** `src/components/common/Input.tsx`

```typescript
interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  // + standard input attributes
}
```

**Usage:**

```tsx
<Input
  label="Email"
  type="email"
  {...register('email')}
  error={errors.email?.message}
/>
```

### 5.4 Select Component

**Path:** `src/components/common/Select.tsx`

```typescript
interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}
```

**Usage:**

```tsx
<Select
  label="Status"
  {...register('status')}
  options={[
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ]}
/>
```

### 5.5 Modal Component

**Path:** `src/components/common/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

**Usage:**

```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Create User"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    {/* Form content */}
  </form>
</Modal>
```

### 5.6 Table Component

**Path:** `src/components/common/Table.tsx`

```typescript
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}
```

**Usage:**

```tsx
const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Status',
    accessor: (row) => <StatusBadge status={row.status} />
  },
  {
    header: 'Actions',
    accessor: (row) => (
      <Button size="sm" onClick={() => handleEdit(row)}>
        Edit
      </Button>
    ),
  },
];

<Table columns={columns} data={users} />
```

### 5.7 Card Component

**Path:** `src/components/common/Card.tsx`

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

**Usage:**

```tsx
<Card
  title="Users Management"
  actions={<Button onClick={handleCreate}>Add User</Button>}
>
  <Table columns={columns} data={users} />
</Card>
```

### 5.8 StatusBadge Component

**Path:** `src/components/common/StatusBadge.tsx`

```typescript
interface StatusBadgeProps {
  status: string;
}
```

**Usage:**

```tsx
<StatusBadge status="ACTIVE" />   // Green badge
<StatusBadge status="INACTIVE" /> // Red badge
<StatusBadge status="PENDING" />  // Yellow badge
```

### 5.9 Pagination Component

**Path:** `src/components/common/Pagination.tsx`

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Usage:**

```tsx
<Pagination
  currentPage={result.pagination.page}
  totalPages={result.pagination.totalPages}
  onPageChange={handlePageChange}
/>
```

---

## 6. Pages

### 6.1 Page Structure by Role

#### Admin Pages (`/admin/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboard | Overview statistics |
| `/admin/users` | UsersPage | User CRUD operations |
| `/admin/trucks` | TrucksPage | Truck CRUD operations |
| `/admin/contracts` | ContractsPage | Contract management |
| `/admin/schedules` | SchedulesPage | Schedule management |
| `/admin/activities` | ActivitiesPage | View all activities |
| `/admin/reports` | ReportsPage | Generate reports |

#### Manager Pages (`/manager/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/manager` | ManagerDashboard | Manager overview |
| `/manager/trucks` | TrucksPage | View/update trucks |
| `/manager/contracts` | ContractsPage | View contracts |
| `/manager/schedules` | SchedulesPage | Manage schedules |
| `/manager/activities` | ActivitiesPage | View activities |
| `/manager/reports` | ReportsPage | Generate reports |

#### Driver Pages (`/driver/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/driver` | DriverDashboard | Personal dashboard |
| `/driver/schedule` | SchedulePage | View assigned schedules |
| `/driver/activities` | ActivitiesPage | Log daily activities |
| `/driver/profile` | ProfilePage | View/edit profile |

### 6.2 Page Implementation Pattern

Semua halaman mengikuti pola yang konsisten:

```tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const ExamplePage = () => {
  // 1. State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const queryClient = useQueryClient();

  // 2. Data fetching with React Query
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => itemsApi.getAll(),
  });

  // 3. Form setup with React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  // 4. Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create item');
    },
  });

  // 5. Event handlers
  const handleCreate = () => {
    setEditingItem(null);
    reset({});
    setIsModalOpen(true);
  };

  const onSubmit = (data: ItemFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // 6. Table column definitions
  const columns = [
    { header: 'Name', accessor: 'name' },
    // ... more columns
  ];

  // 7. Loading state
  if (isLoading) return <LoadingSpinner />;

  // 8. Render
  return (
    <div>
      <Card title="Items" actions={<Button onClick={handleCreate}>Add</Button>}>
        <Table columns={columns} data={data || []} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
        </form>
      </Modal>
    </div>
  );
};
```

---

## 7. API Integration

### 7.1 Axios Configuration

**Path:** `src/api/axios.ts`

```typescript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles errors & token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - attempt token refresh
    // Handle 403, 404, 500 - show toast notifications
    return Promise.reject(error);
  }
);
```

### 7.2 API Module Pattern

Setiap entitas memiliki API module sendiri dengan pola yang konsisten:

```typescript
// src/api/example.api.ts
import axios from './axios';
import { Example, ExampleFormData, ApiResponse, PaginatedResponse } from '@/types';

export const examplesApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Example>> => {
    const response = await axios.get<ApiResponse<Example[]>>('/examples', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<Example> => {
    const response = await axios.get<ApiResponse<Example>>(`/examples/${id}`);
    return response.data.data!;
  },

  create: async (data: ExampleFormData): Promise<Example> => {
    const response = await axios.post<ApiResponse<Example>>('/examples', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<ExampleFormData>): Promise<Example> => {
    const response = await axios.put<ApiResponse<Example>>(`/examples/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/examples/${id}`);
  },
};
```

### 7.3 API Response Types

```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMetadata;
  errors?: Array<{ field: string; message: string }>;
}

// Paginated Response
interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// Pagination Metadata
interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### 7.4 API Endpoints Reference

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| **Auth** | `/auth/login` | POST | User login |
| | `/auth/logout` | POST | User logout |
| | `/auth/refresh` | POST | Refresh token |
| | `/auth/me` | GET | Get current user |
| **Users** | `/users` | GET | List users |
| | `/users/:id` | GET | Get user |
| | `/users` | POST | Create user |
| | `/users/:id` | PUT | Update user |
| | `/users/:id` | DELETE | Delete user |
| **Drivers** | `/drivers` | GET | List drivers |
| | `/drivers/:id` | GET | Get driver |
| | `/drivers` | POST | Create driver |
| | `/drivers/:id` | PUT | Update driver |
| | `/drivers/:id` | DELETE | Delete driver |
| **Trucks** | `/dump-trucks` | GET | List trucks |
| | `/dump-trucks/:id` | GET | Get truck |
| | `/dump-trucks` | POST | Create truck |
| | `/dump-trucks/:id` | PUT | Update truck |
| | `/dump-trucks/:id` | DELETE | Delete truck |
| **Contracts** | `/contracts` | GET | List contracts |
| | `/contracts/:id` | GET | Get contract |
| | `/contracts` | POST | Create contract |
| | `/contracts/:id` | PUT | Update contract |
| | `/contracts/:id` | DELETE | Delete contract |
| **Schedules** | `/schedules` | GET | List schedules |
| | `/schedules/my` | GET | Get user's schedules |
| | `/schedules/:id` | GET | Get schedule |
| | `/schedules` | POST | Create schedule |
| | `/schedules/:id` | PUT | Update schedule |
| | `/schedules/:id` | DELETE | Delete schedule |
| **Activities** | `/activities` | GET | List activities |
| | `/activities/my` | GET | Get user's activities |
| | `/activities` | POST | Log activity |
| **Reports** | `/reports/operations` | GET | Operations report |
| | `/reports/efficiency` | GET | Efficiency report |
| | `/reports/drivers` | GET | Driver report |
| | `/reports/contracts` | GET | Contract report |
| | `/reports/export` | GET | Export report |

---

## 8. State Management

### 8.1 Server State (React Query)

React Query digunakan untuk mengelola server state (data dari API).

```typescript
// Query - fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['users', page],
  queryFn: () => usersApi.getAll({ page }),
});

// Mutation - modify data
const mutation = useMutation({
  mutationFn: usersApi.create,
  onSuccess: () => {
    // Invalidate cache to refetch
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

### 8.2 Client State (useState/useContext)

Client state dikelola dengan React hooks standar:

```typescript
// Local component state
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingItem, setEditingItem] = useState<Item | null>(null);

// Global auth state via Context
const { user, isAuthenticated, login, logout } = useAuth();
```

### 8.3 Form State (React Hook Form)

Form state dikelola dengan React Hook Form:

```typescript
const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors, isSubmitting },
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});
```

---

## 9. Routing & Navigation

### 9.1 Route Configuration

**Path:** `src/routes/AppRoutes.tsx`

```typescript
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    {/* Admin routes */}
    <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        {/* ... more admin routes */}
      </Route>
    </Route>

    {/* Manager routes */}
    <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
      {/* ... manager routes */}
    </Route>

    {/* Driver routes */}
    <Route element={<RoleRoute allowedRoles={['DRIVER']} />}>
      {/* ... driver routes */}
    </Route>
  </Route>

  {/* Default redirect */}
  <Route path="*" element={<Navigate to="/login" />} />
</Routes>
```

### 9.2 Protected Route

Memastikan user sudah login:

```typescript
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};
```

### 9.3 Role Route

Memastikan user memiliki role yang sesuai:

```typescript
const RoleRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user?.role.toLowerCase()}`} />;
  }

  return <Outlet />;
};
```

---

## 10. Authentication & Authorization

### 10.1 Auth Context

**Path:** `src/features/auth/AuthContext.tsx`

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = () => useContext(AuthContext);
```

### 10.2 Auth Provider

**Path:** `src/features/auth/AuthProvider.tsx`

Features:
- Auto-check authentication on app mount
- Store token di localStorage
- Redirect berdasarkan role setelah login
- Handle token refresh

```typescript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch {
        localStorage.removeItem('accessToken');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('accessToken', response.accessToken);
    setUser(response.user);
    // Redirect based on role
    navigate(`/${response.user.role.toLowerCase()}`);
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 10.3 Token Management

| Token Type | Storage | Usage |
|------------|---------|-------|
| Access Token | localStorage | Bearer token di request headers |
| Refresh Token | HTTP-only cookie | Auto-refresh saat access token expired |

---

## 11. Form Handling & Validation

### 11.1 React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/utils/validators';

const {
  register,
  handleSubmit,
  reset,
  watch,
  control,
  formState: { errors, isSubmitting },
} = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: {
    name: '',
    email: '',
    role: 'DRIVER',
  },
});
```

### 11.2 Zod Validation Schemas

**Path:** `src/utils/validators.ts`

```typescript
// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User schema with conditional validation
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8).optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'DRIVER']),
  driverInfo: z.object({
    licenseNumber: z.string().min(1),
    phone: z.string().min(1),
  }).optional(),
}).refine((data) => {
  if (data.role === 'DRIVER') {
    return data.driverInfo !== undefined;
  }
  return true;
}, {
  message: 'Driver info is required when role is DRIVER',
  path: ['driverInfo'],
});

// Schedule schema with time format validation
export const scheduleSchema = z.object({
  contractId: z.string().uuid('Invalid contract ID'),
  dumpTruckId: z.string().uuid('Invalid dump truck ID'),
  driverId: z.string().uuid('Invalid driver ID'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
});
```

### 11.3 Form Error Display

```tsx
<Input
  label="Email"
  type="email"
  {...register('email')}
  error={errors.email?.message}
/>
```

---

## 12. Utilities & Helpers

### 12.1 Constants

**Path:** `src/utils/constants.ts`

```typescript
// Roles
export const ROLES = { ADMIN: 'ADMIN', MANAGER: 'MANAGER', DRIVER: 'DRIVER' };
export const ROLE_LABELS = { ADMIN: 'Administrator', MANAGER: 'Manager', DRIVER: 'Driver' };

// Status constants
export const DRIVER_STATUS = { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' };
export const TRUCK_STATUS = { READY: 'READY', OPERATING: 'OPERATING', MAINTENANCE: 'MAINTENANCE' };
export const CONTRACT_STATUS = { ACTIVE: 'ACTIVE', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };
export const SCHEDULE_STATUS = { SCHEDULED: 'SCHEDULED', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };

// Status colors for badges
export const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800',
  READY: 'bg-green-100 text-green-800',
  OPERATING: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Dump Truck Management System';
```

### 12.2 Formatters

**Path:** `src/utils/formatters.ts`

```typescript
import { format } from 'date-fns';

// Format date: "Jan 15, 2024"
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

// Format datetime: "Jan 15, 2024 14:30"
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

// Format time: "14:30"
export const formatTime = (time: string): string => {
  return time;
};

// Format currency: "Rp 1.500.000"
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousand separators: "1,500,000"
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};
```

---

## 13. Styling Guide

### 13.1 Tailwind CSS Configuration

**Path:** `tailwind.config.js`

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          // ... slate color palette
          900: '#0f172a',
        },
        accent: {
          green: '#10b981',
          blue: '#3b82f6',
          orange: '#f97316',
        },
        sidebar: {
          bg: '#1e293b',
          hover: '#334155',
          active: '#3b82f6',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12)',
        elevated: '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
};
```

### 13.2 Common CSS Classes

| Purpose | Classes |
|---------|---------|
| Card | `bg-white rounded-lg shadow-card p-6` |
| Input | `w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500` |
| Primary Button | `bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg` |
| Danger Button | `bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg` |
| Badge | `px-2 py-1 text-xs font-medium rounded-full` |

### 13.3 Layout Structure

```
┌────────────────────────────────────────────────────────┐
│ Sidebar (w-64)    │        Main Content               │
│                   │  ┌──────────────────────────────┐ │
│ - Logo            │  │  Topbar                      │ │
│ - Navigation      │  └──────────────────────────────┘ │
│ - User menu       │  ┌──────────────────────────────┐ │
│                   │  │                              │ │
│                   │  │  Page Content                │ │
│                   │  │  (Outlet)                    │ │
│                   │  │                              │ │
│                   │  └──────────────────────────────┘ │
└───────────────────┴────────────────────────────────────┘
```

---

## 14. Environment Configuration

### 14.1 Environment Variables

**File:** `.env`

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Application
VITE_APP_NAME=Dump Truck Management System
```

### 14.2 Accessing Environment Variables

```typescript
// Vite environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## 15. Error Handling

### 15.1 API Error Handling

```typescript
// In axios interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const backendMessage = error.response?.data?.message;

    if (status === 403) {
      toast.error(backendMessage || 'Access denied');
    } else if (status === 404) {
      toast.error(backendMessage || 'Resource not found');
    } else if (status === 500) {
      toast.error(backendMessage || 'Server error');
    }

    return Promise.reject(error);
  }
);
```

### 15.2 Mutation Error Handling

```typescript
const mutation = useMutation({
  mutationFn: api.create,
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Operation failed');
  },
});
```

### 15.3 Error Boundaries

Untuk production, tambahkan Error Boundary:

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 16. Testing

### 16.1 Testing Stack (Recommended)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 16.2 Unit Test Example

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 17. Build & Deployment

### 17.1 Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
```

### 17.2 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── index-[hash].css     # Styles
│   └── vendor-[hash].js     # Dependencies
```

### 17.3 Deployment Checklist

- [ ] Set production environment variables
- [ ] Build with `npm run build`
- [ ] Configure web server for SPA routing
- [ ] Set up HTTPS
- [ ] Configure CORS on backend
- [ ] Test authentication flow
- [ ] Verify API endpoints

### 17.4 Nginx Configuration (Example)

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/frontend/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
    }
}
```

---

## 18. Troubleshooting

### 18.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS errors | Backend tidak mengizinkan frontend origin | Konfigurasi CORS di backend |
| 401 after refresh | Token expired dan refresh gagal | Cek endpoint refresh token |
| Blank page | JavaScript error | Cek browser console |
| Form not submitting | Validation error | Cek Zod schema dan form errors |
| Data not updating | Query cache stale | Call `queryClient.invalidateQueries()` |

### 18.2 Debug Mode

```typescript
// Enable React Query devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### 18.3 Network Debugging

1. Buka Browser DevTools → Network tab
2. Filter by XHR/Fetch
3. Cek request headers (Authorization token)
4. Cek response body untuk error messages

---

## 19. Contributing Guidelines

### 19.1 Code Style

- Gunakan TypeScript untuk semua file
- Ikuti ESLint rules yang sudah dikonfigurasi
- Gunakan Prettier untuk formatting
- Nama file: PascalCase untuk components, camelCase untuk utilities

### 19.2 Component Guidelines

```typescript
// Good: Typed props with interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', children }: ButtonProps) => {
  // ...
};

// Good: Export as named export
export default Button;
```

### 19.3 Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-user-export

# Make changes and commit
git add .
git commit -m "feat: add user export functionality"

# Push and create PR
git push origin feature/add-user-export
```

### 19.4 Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(users): add export to CSV
- fix(auth): handle token refresh error
- docs(readme): update installation steps
```

---

## 20. Changelog

### Version 1.0.0 (January 2026)

#### Features
- Initial release
- User management (Admin)
- Driver management
- Truck management
- Contract management
- Schedule management
- Activity logging
- Reports generation
- Role-based access control

#### Technical
- React 18 with TypeScript
- Vite build system
- Tailwind CSS styling
- React Query for data fetching
- React Hook Form with Zod validation
- JWT authentication with refresh token

---

## Appendix

### A. Type Definitions Quick Reference

```typescript
// User
type Role = 'ADMIN' | 'MANAGER' | 'DRIVER';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  driver?: Driver | null;
}

// Driver
type DriverStatus = 'ACTIVE' | 'INACTIVE';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: DriverStatus;
}

// Truck
type TruckStatus = 'READY' | 'OPERATING' | 'MAINTENANCE';

interface DumpTruck {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  status: TruckStatus;
}

// Contract
type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

interface Contract {
  id: string;
  clientName: string;
  location: string;
  startDate: string;
  endDate: string;
  numberOfTrucks: number;
  price: number;
  status: ContractStatus;
}

// Schedule
type ScheduleStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

interface Schedule {
  id: string;
  contractId: string;
  dumpTruckId: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}
```

### B. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Enter` | Submit form (when focused) |

### C. Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |

---

**Document maintained by:** Development Team
**Last review:** January 2026
**Next review:** April 2026
