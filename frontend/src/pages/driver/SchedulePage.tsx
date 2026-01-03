import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '@/api/schedules.api';
import { Schedule } from '@/types';
import { formatDate } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const SchedulePage = () => {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['my-schedules'],
    queryFn: () => schedulesApi.getMySchedules(),
  });

  const columns = [
    {
      header: 'Contract',
      accessor: (row: Schedule) => row.contract?.clientName || 'N/A',
    },
    {
      header: 'Location',
      accessor: (row: Schedule) => row.contract?.location || 'N/A',
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
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card title="My Schedules">
        <Table columns={columns} data={schedules?.data || []} />
      </Card>
    </div>
  );
};

export default SchedulePage;
