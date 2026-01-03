import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { activitiesApi } from '@/api/activities.api';
import { schedulesApi } from '@/api/schedules.api';
import { ActivityLog, ActivityLogFormData } from '@/types';
import { activityLogSchema } from '@/utils/validators';
import { formatDate, formatDateTime } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ActivitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['my-activities'],
    queryFn: () => activitiesApi.getMyActivities(),
  });

  const { data: schedules } = useQuery({
    queryKey: ['my-schedules-for-activity'],
    queryFn: () => schedulesApi.getMySchedules(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityLogFormData>({
    resolver: zodResolver(activityLogSchema),
  });

  const createMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-activities'] });
      toast.success('Activity logged successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to log activity');
    },
  });

  const handleCreate = () => {
    reset({});
    setIsModalOpen(true);
  };

  const onSubmit = (data: ActivityLogFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    {
      header: 'Truck',
      accessor: (row: ActivityLog) => row.dumpTruck?.plateNumber || 'N/A',
    },
    {
      header: 'Date',
      accessor: (row: ActivityLog) => formatDate(row.date),
    },
    {
      header: 'Start Time',
      accessor: (row: ActivityLog) => formatDateTime(row.startTime),
    },
    {
      header: 'End Time',
      accessor: (row: ActivityLog) => row.endTime ? formatDateTime(row.endTime) : 'In Progress',
    },
    {
      header: 'Loads',
      accessor: 'numberOfLoads' as keyof ActivityLog,
    },
    {
      header: 'Location',
      accessor: 'location' as keyof ActivityLog,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card
        title="My Activities"
        actions={
          <Button onClick={handleCreate}>
            Log Activity
          </Button>
        }
      >
        <Table columns={columns} data={activities?.data || []} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Log Activity"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Dump Truck"
            {...register('dumpTruckId')}
            error={errors.dumpTruckId?.message}
            options={[
              { value: '', label: 'Select Truck' },
              ...(schedules?.data?.map((schedule) => ({
                value: schedule.dumpTruckId,
                label: `${schedule.dumpTruck?.plateNumber || 'N/A'} - ${schedule.contract?.clientName || 'N/A'}`,
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
            type="datetime-local"
            {...register('startTime')}
            error={errors.startTime?.message}
          />

          <Input
            label="End Time (optional)"
            type="datetime-local"
            {...register('endTime')}
            error={errors.endTime?.message}
          />

          <Input
            label="Number of Loads"
            type="number"
            {...register('numberOfLoads', { valueAsNumber: true })}
            error={errors.numberOfLoads?.message}
          />

          <Input
            label="Location"
            {...register('location')}
            error={errors.location?.message}
          />

          <Input
            label="Notes (optional)"
            {...register('notes')}
            error={errors.notes?.message}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ActivitiesPage;
