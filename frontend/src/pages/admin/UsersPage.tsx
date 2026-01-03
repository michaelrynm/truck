import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users.api';
import { User, UserFormData } from '@/types';
import { userSchema } from '@/utils/validators';
import { ROLE_LABELS } from '@/utils/constants';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => usersApi.getAll({ page: currentPage, limit: 10 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setEditingUser(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    reset({});
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      driverInfo: user.driver ? {
        licenseNumber: user.driver.licenseNumber,
        phone: user.driver.phone,
      } : undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    {
      header: 'Role',
      accessor: (row: User) => (
        <span className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
          {ROLE_LABELS[row.role]}
        </span>
      ),
    },
    {
      header: 'License',
      accessor: (row: User) => row.driver?.licenseNumber || '-',
    },
    {
      header: 'Phone',
      accessor: (row: User) => row.driver?.phone || '-',
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card
        title="Users Management"
        actions={
          <Button onClick={handleCreate}>
            Create User
          </Button>
        }
      >
        <Table columns={columns} data={result?.data || []} />

        {result?.pagination && (
          <Pagination
            currentPage={result.pagination.page}
            totalPages={result.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          reset();
        }}
        title={editingUser ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
          )}

          <Select
            label="Role"
            {...register('role')}
            error={errors.role?.message}
            options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'DRIVER', label: 'Driver' },
            ]}
          />

          {selectedRole === 'DRIVER' && (
            <>
              <Input
                label="License Number"
                {...register('driverInfo.licenseNumber')}
                error={errors.driverInfo?.licenseNumber?.message}
              />

              <Input
                label="Phone"
                {...register('driverInfo.phone')}
                error={errors.driverInfo?.phone?.message}
              />
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
