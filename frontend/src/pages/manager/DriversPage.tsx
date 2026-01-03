import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { driversApi } from '@/api/drivers.api';
import { Driver, DriverFormData } from '@/types';
import { driverSchema } from '@/utils/validators';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const DriversPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: result, isLoading } = useQuery({
    queryKey: ['drivers', currentPage],
    queryFn: () => driversApi.getAll({ page: currentPage, limit: 10 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const createMutation = useMutation({
    mutationFn: driversApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create driver');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DriverFormData> }) =>
      driversApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver updated successfully');
      setIsModalOpen(false);
      setEditingDriver(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update driver');
    },
  });

  const handleCreate = () => {
    setEditingDriver(null);
    reset({});
    setIsModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    reset({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      address: driver.address || undefined,
      status: driver.status,
      userId: driver.userId,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: DriverFormData) => {
    if (editingDriver) {
      updateMutation.mutate({ id: editingDriver.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Driver },
    { header: 'License Number', accessor: 'licenseNumber' as keyof Driver },
    { header: 'Phone', accessor: 'phone' as keyof Driver },
    {
      header: 'Status',
      accessor: (row: Driver) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row: Driver) => (
        <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
          Edit
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card
        title="Drivers Management"
        actions={
          <Button onClick={handleCreate}>
            Create Driver
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
          setEditingDriver(null);
          reset();
        }}
        title={editingDriver ? 'Edit Driver' : 'Create Driver'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="License Number"
            {...register('licenseNumber')}
            error={errors.licenseNumber?.message}
          />

          <Input
            label="Phone"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDriver(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingDriver ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DriversPage;
