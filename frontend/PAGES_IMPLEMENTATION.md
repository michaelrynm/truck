# Pages Implementation Guide

All page components for the Dump Truck Management System frontend.

## Login Page

### File: `src/pages/Login.tsx`

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { loginSchema } from '@/utils/validators';
import { LoginCredentials } from '@/types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { APP_NAME } from '@/utils/constants';

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error handling done in AuthProvider
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Truck className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">{APP_NAME}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Default Credentials</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <p>Admin: admin@dumptruck.com / password123</p>
              <p>Manager: manager1@dumptruck.com / password123</p>
              <p>Driver: driver1@dumptruck.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

## Admin Pages

### File: `src/pages/admin/Dashboard.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { Users, UserCog, Truck, FileText } from 'lucide-react';
import { usersApi } from '@/api/users.api';
import { driversApi } from '@/api/drivers.api';
import { dumpTrucksApi } from '@/api/dumpTrucks.api';
import { contractsApi } from '@/api/contracts.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: usersApi.getAll,
  });

  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['drivers', 'list'],
    queryFn: driversApi.getAll,
  });

  const { data: trucks, isLoading: trucksLoading } = useQuery({
    queryKey: ['dump-trucks', 'list'],
    queryFn: dumpTrucksApi.getAll,
  });

  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['contracts', 'list'],
    queryFn: contractsApi.getAll,
  });

  const stats = [
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Drivers',
      value: drivers?.length || 0,
      icon: UserCog,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Trucks',
      value: trucks?.length || 0,
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Active Contracts',
      value: contracts?.filter((c) => c.status === 'ACTIVE').length || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (usersLoading || driversLoading || trucksLoading || contractsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-sm text-gray-500">Activity tracking coming soon...</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Use the sidebar to navigate to different sections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### File: `src/pages/admin/Users.tsx`

```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users.api';
import { User, UserFormData } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { formatDate } from '@/utils/formatters';

const Users = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: usersApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {!users || users.length === 0 ? (
        <EmptyState message="No users found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <StatusBadge status={user.role} />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Users;
```

---

### Note on Remaining Pages

Due to length constraints, I've provided the key pages above. The remaining pages follow the same pattern:

**Admin Pages** (similar structure to Users.tsx):
- Drivers.tsx
- DumpTrucks.tsx
- Contracts.tsx
- Schedules.tsx
- Activities.tsx
- Reports.tsx

**Manager Pages** (same as Admin but different route):
- Dashboard.tsx (similar to Admin)
- Drivers.tsx
- DumpTrucks.tsx
- Contracts.tsx
- Schedules.tsx
- Activities.tsx
- Reports.tsx

**Driver Pages** (simpler CRUD):
- Dashboard.tsx
- MySchedules.tsx
- SubmitActivity.tsx
- MyActivities.tsx

## Pattern to Follow

All CRUD pages follow this pattern:
1. Import necessary hooks and components
2. Use React Query for data fetching
3. Use mutations for create/update/delete
4. Display data in tables
5. Handle loading and empty states
6. Show toast notifications for success/error

```typescript
// Standard CRUD page pattern
const EntityPage = () => {
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['entity', 'list'],
    queryFn: entityApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: entityApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity'] });
      toast.success('Deleted successfully');
    },
  });

  // Render table with data
  return (
    <div>
      <h1>Entity List</h1>
      <Table>
        {/* Table content */}
      </Table>
    </div>
  );
};
```

Would you like me to create the remaining page files, or can you follow this pattern to complete them?
