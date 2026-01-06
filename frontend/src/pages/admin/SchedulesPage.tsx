import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { schedulesApi } from '@/api/schedules.api';
import { contractsApi } from '@/api/contracts.api';
import { driversApi } from '@/api/drivers.api';
import { dumpTrucksApi } from '@/api/dumpTrucks.api';
import { Schedule, ScheduleFormData } from '@/types';
import { scheduleSchema } from '@/utils/validators';
import { formatDate } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const SchedulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: result, isLoading } = useQuery({
    queryKey: ['schedules', currentPage],
    queryFn: () => schedulesApi.getAll({ page: currentPage, limit: 10 }),
  });

  const { data: contractsResult } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.getAll(),
  });

  const { data: driversResult } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driversApi.getAll(),
  });

  const { data: trucksResult } = useQuery({
    queryKey: ['trucks'],
    queryFn: () => dumpTrucksApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

  const createMutation = useMutation({
    mutationFn: schedulesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Schedule created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScheduleFormData> }) =>
      schedulesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Schedule updated successfully');
      setIsModalOpen(false);
      setEditingSchedule(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: schedulesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Schedule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    },
  });

  const handleCreate = () => {
    setEditingSchedule(null);
    reset({});
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    reset({
      contractId: schedule.contractId,
      driverId: schedule.driverId,
      dumpTruckId: schedule.dumpTruckId,
      date: schedule.date.split('T')[0],
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ScheduleFormData) => {
    if (editingSchedule) {
      updateMutation.mutate({ id: editingSchedule.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const columns = [
    {
      header: 'Contract',
      accessor: (row: Schedule) => row.contract?.clientName || 'N/A',
    },
    {
      header: 'Driver',
      accessor: (row: Schedule) => row.driver?.name || 'N/A',
    },
    {
      header: 'Truck',
      accessor: (row: Schedule) => row.dumpTruck?.plateNumber || 'N/A',
    },
    {
      header: 'Date',
      accessor: (row: Schedule) => formatDate(row.date),
    },
    {
      header: 'Time',
      accessor: (row: Schedule) => `${row.startTime} - ${row.endTime}`,
    },
    {
      header: 'Status',
      accessor: (row: Schedule) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row: Schedule) => (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
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
        title="Schedules Management"
        actions={
          <Button onClick={handleCreate}>
            Create Schedule
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
          setEditingSchedule(null);
          reset();
        }}
        title={editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Contract"
            {...register('contractId')}
            error={errors.contractId?.message}
            options={[
              { value: '', label: 'Select Contract' },
              ...(contractsResult?.data?.map((c) => ({
                value: c.id,
                label: `${c.clientName} - ${c.location}`,
              })) || []),
            ]}
          />

          <Select
            label="Driver"
            {...register('driverId')}
            error={errors.driverId?.message}
            options={[
              { value: '', label: 'Select Driver' },
              ...(driversResult?.data?.map((d) => ({
                value: d.id,
                label: d.name,
              })) || []),
            ]}
          />

          <Select
            label="Truck"
            {...register('dumpTruckId')}
            error={errors.dumpTruckId?.message}
            options={[
              { value: '', label: 'Select Truck' },
              ...(trucksResult?.data?.map((t) => ({
                value: t.id,
                label: `${t.plateNumber} - ${t.type}`,
              })) || []),
            ]}
          />

          <Input
            label="Date"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />

          <Input
            label="Start Time"
            type="time"
            {...register('startTime')}
            error={errors.startTime?.message}
          />

          <Input
            label="End Time"
            type="time"
            {...register('endTime')}
            error={errors.endTime?.message}
          />

          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSchedule(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingSchedule ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulesPage;
