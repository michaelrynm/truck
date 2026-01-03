import { DriverStatus, TruckStatus, ContractStatus, ScheduleStatus } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';

type StatusType = DriverStatus | TruckStatus | ContractStatus | ScheduleStatus;

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
