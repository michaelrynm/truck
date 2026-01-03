import { UserStatus, TruckStatus, ContractStatus, ScheduleStatus } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
  status: UserStatus | TruckStatus | ContractStatus | ScheduleStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
