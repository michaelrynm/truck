# Complete Frontend Implementation Guide

This document contains ALL remaining code needed to complete the frontend.

## Table of Contents
1. [Routing](#routing)
2. [Common Components](#common-components)
3. [Layout Components](#layout-components)
4. [Pages](#pages)
5. [Custom Hooks](#custom-hooks)

---

## File Creation Progress

### Already Created ✅
- Project configuration files
- TypeScript types (src/types/)
- Utils (src/utils/)
- API services (src/api/)
- Auth context (src/features/auth/)
- Main app files (main.tsx, App.tsx)

### Need to Create ⏳
- Routing (3 files)
- Common components (10+ files)
- Layouts (3 files)
- Pages (15+ files)
- Hooks (3 files)

---

## Important Notes

1. **Corporate UI Style**: All components use clean, professional styling
   - No gradients
   - No emojis
   - Simple, flat colors
   - Professional typography
   - Clean borders and spacing

2. **File Paths**: Create each file at the exact path shown
3. **Copy Entire Code Block**: Copy from \`\`\` to \`\`\`
4. **TypeScript**: All files use `.tsx` or `.ts` extension
5. **Imports**: Use path alias `@/` for imports

---

## ROUTING

### File: `src/routes/AppRoutes.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Login from '@/pages/Login';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminDrivers from '@/pages/admin/Drivers';
import AdminDumpTrucks from '@/pages/admin/DumpTrucks';
import AdminContracts from '@/pages/admin/Contracts';
import AdminSchedules from '@/pages/admin/Schedules';
import AdminActivities from '@/pages/admin/Activities';
import AdminReports from '@/pages/admin/Reports';

// Manager Pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerDrivers from '@/pages/manager/Drivers';
import ManagerDumpTrucks from '@/pages/manager/DumpTrucks';
import ManagerContracts from '@/pages/manager/Contracts';
import ManagerSchedules from '@/pages/manager/Schedules';
import ManagerActivities from '@/pages/manager/Activities';
import ManagerReports from '@/pages/manager/Reports';

// Driver Pages
import DriverDashboard from '@/pages/driver/Dashboard';
import DriverSchedules from '@/pages/driver/MySchedules';
import DriverSubmitActivity from '@/pages/driver/SubmitActivity';
import DriverActivities from '@/pages/driver/MyActivities';

const AppRoutes = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            {user?.role === 'ADMIN' && <Navigate to="/admin/dashboard" />}
            {user?.role === 'MANAGER' && <Navigate to="/manager/dashboard" />}
            {user?.role === 'DRIVER' && <Navigate to="/driver/dashboard" />}
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="dump-trucks" element={<AdminDumpTrucks />} />
        <Route path="contracts" element={<AdminContracts />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<RoleRoute allowedRoles={['MANAGER']} />}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="drivers" element={<ManagerDrivers />} />
        <Route path="dump-trucks" element={<ManagerDumpTrucks />} />
        <Route path="contracts" element={<ManagerContracts />} />
        <Route path="schedules" element={<ManagerSchedules />} />
        <Route path="activities" element={<ManagerActivities />} />
        <Route path="reports" element={<ManagerReports />} />
      </Route>

      {/* Driver Routes */}
      <Route path="/driver" element={<RoleRoute allowedRoles={['DRIVER']} />}>
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="schedules" element={<DriverSchedules />} />
        <Route path="submit-activity" element={<DriverSubmitActivity />} />
        <Route path="activities" element={<DriverActivities />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
```

### File: `src/routes/ProtectedRoute.tsx`

```typescript
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### File: `src/routes/RoleRoute.tsx`

```typescript
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Role } from '@/types';

interface RoleRouteProps {
  allowedRoles: Role[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default RoleRoute;
```

---

## COMMON COMPONENTS

### File: `src/components/common/Button.tsx`

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  isLoading,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'btn inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
```

### File: `src/components/common/Input.tsx`

```typescript
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

### File: `src/components/common/Select.tsx`

```typescript
import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
```

### File: `src/components/common/StatusBadge.tsx`

```typescript
import { STATUS_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
```

### File: `src/components/common/Modal.tsx`

```typescript
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        <div className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidthClasses[maxWidth]}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

### File: `src/components/common/Table.tsx`

```typescript
import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children }: TableProps) => {
  return (
    <div className="table-container">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
};

export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, onClick }: TableRowProps) => {
  return (
    <tr
      className={`${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }: TableHeadProps) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
};
```

### File: `src/components/common/LoadingSpinner.tsx`

```typescript
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
```

### File: `src/components/common/EmptyState.tsx`

```typescript
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No data available' }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No data</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
```

---

## LAYOUT COMPONENTS

### File: `src/layouts/DashboardLayout.tsx`

```typescript
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

### File: `src/layouts/Sidebar.tsx`

```typescript
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Truck,
  FileText,
  Calendar,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { APP_NAME } from '@/utils/constants';

const Sidebar = () => {
  const { user } = useAuth();

  const adminMenu = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Drivers', href: '/admin/drivers', icon: UserCog },
    { name: 'Dump Trucks', href: '/admin/dump-trucks', icon: Truck },
    { name: 'Contracts', href: '/admin/contracts', icon: FileText },
    { name: 'Schedules', href: '/admin/schedules', icon: Calendar },
    { name: 'Activities', href: '/admin/activities', icon: ClipboardList },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ];

  const managerMenu = [
    { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
    { name: 'Drivers', href: '/manager/drivers', icon: UserCog },
    { name: 'Dump Trucks', href: '/manager/dump-trucks', icon: Truck },
    { name: 'Contracts', href: '/manager/contracts', icon: FileText },
    { name: 'Schedules', href: '/manager/schedules', icon: Calendar },
    { name: 'Activities', href: '/manager/activities', icon: ClipboardList },
    { name: 'Reports', href: '/manager/reports', icon: BarChart3 },
  ];

  const driverMenu = [
    { name: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard },
    { name: 'My Schedules', href: '/driver/schedules', icon: Calendar },
    { name: 'Submit Activity', href: '/driver/submit-activity', icon: ClipboardList },
    { name: 'My Activities', href: '/driver/activities', icon: FileText },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return adminMenu;
      case 'MANAGER':
        return managerMenu;
      case 'DRIVER':
        return driverMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 py-5 border-b border-gray-200">
          <Truck className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">{APP_NAME}</span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
```

### File: `src/layouts/Topbar.tsx`

```typescript
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Topbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1"></div>

        <div className="ml-4 flex items-center md:ml-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center max-w-xs rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 hover:bg-gray-50"
            >
              <div className="text-right mr-3">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
```

---

Due to the length of this document, the remaining pages code (Login, Dashboard pages, etc.) should be provided in a separate file.

**Next steps:**
1. Create the routing files above
2. Create the common components
3. Create the layout components
4. Then I'll provide all the page components in a separate guide

Would you like me to continue with the page components in another document?
