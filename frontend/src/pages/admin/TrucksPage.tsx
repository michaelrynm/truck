import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dumpTrucksApi } from '@/api/dumpTrucks.api';
import { DumpTruck, DumpTruckFormData } from '@/types';
import { dumpTruckSchema } from '@/utils/validators';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const TrucksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<DumpTruck | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ['trucks', currentPage],
    queryFn: () => dumpTrucksApi.getAll({ page: currentPage, limit: 10 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DumpTruckFormData>({
    resolver: zodResolver(dumpTruckSchema),
  });

  const createMutation = useMutation({
    mutationFn: dumpTrucksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      toast.success('Truck created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create truck');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DumpTruckFormData> }) =>
      dumpTrucksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      toast.success('Truck updated successfully');
      setIsModalOpen(false);
      setEditingTruck(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update truck');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dumpTrucksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      toast.success('Truck deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete truck');
    },
  });

  const handleCreate = () => {
    setEditingTruck(null);
    reset({});
    setIsModalOpen(true);
  };

  const handleEdit = (truck: DumpTruck) => {
    setEditingTruck(truck);
    reset(truck);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const onSubmit = (data: DumpTruckFormData) => {
    if (editingTruck) {
      updateMutation.mutate({ id: editingTruck.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { header: 'Plate Number', accessor: 'plateNumber' as keyof DumpTruck },
    { header: 'Brand', accessor: 'brand' as keyof DumpTruck },
    { header: 'Model', accessor: 'model' as keyof DumpTruck },
    { header: 'Year', accessor: 'year' as keyof DumpTruck },
    {
      header: 'Status',
      accessor: (row: DumpTruck) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row: DumpTruck) => (
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
        title="Trucks Management"
        actions={
          <Button onClick={handleCreate}>
            Create Truck
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
          setEditingTruck(null);
          reset();
        }}
        title={editingTruck ? 'Edit Truck' : 'Create Truck'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Plate Number"
            {...register('plateNumber')}
            error={errors.plateNumber?.message}
          />

          <Input
            label="Brand"
            {...register('brand')}
            error={errors.brand?.message}
          />

          <Input
            label="Model"
            {...register('model')}
            error={errors.model?.message}
          />

          <Input
            label="Year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            error={errors.year?.message}
          />

          <Input
            label="Type"
            {...register('type')}
            error={errors.type?.message}
            placeholder="e.g., Standard, Articulated, Transfer"
          />

          <Input
            label="Capacity (Tons)"
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            error={errors.capacity?.message}
          />

          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'READY', label: 'Ready' },
              { value: 'OPERATING', label: 'Operating' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTruck(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingTruck ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrucksPage;
