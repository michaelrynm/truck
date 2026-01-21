import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';
import { driversApi } from '@/api/drivers.api';
import { dumpTrucksApi } from '@/api/dumpTrucks.api';
import { contractsApi } from '@/api/contracts.api';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Users, Truck, FileText, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll({ limit: 9999 }),
  });

  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driversApi.getAll({ limit: 9999 }),
  });

  const { data: trucks, isLoading: trucksLoading } = useQuery({
    queryKey: ['trucks'],
    queryFn: () => dumpTrucksApi.getAll({ limit: 9999 }),
  });

  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.getAll(undefined, { limit: 9999 }),
  });

  if (usersLoading || driversLoading || trucksLoading || contractsLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Total Users',
      value: users?.data?.length || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Drivers',
      value: drivers?.data?.length || 0,
      icon: UserCheck,
      color: 'green',
    },
    {
      title: 'Total Trucks',
      value: trucks?.pagination?.total || 0,
      icon: Truck,
      color: 'orange',
    },
    {
      title: 'Active Contracts',
      value: contracts?.data?.filter((c) => c.status === 'ACTIVE').length || 0,
      icon: FileText,
      color: 'slate',
    },
  ];

  const iconColors = {
    blue: 'bg-blue-900/10 text-blue-800',
    green: 'bg-green-900/10 text-green-800',
    orange: 'bg-orange-900/10 text-orange-800',
    slate: 'bg-slate-100 text-slate-600',
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-900/10 text-blue-800 border-blue-800/20';
      case 'MANAGER':
        return 'bg-green-900/10 text-green-800 border-green-800/20';
      case 'DRIVER':
        return 'bg-orange-900/10 text-orange-800 border-orange-800/20';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">Overview of your fleet management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="order-2 md:order-1">
                  <p className="text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 md:mt-2">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center order-1 md:order-2 ${iconColors[stat.color as keyof typeof iconColors]}`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title="Recent Users" subtitle="Latest registered users">
          <div className="space-y-2 md:space-y-3">
            {users?.data?.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs md:text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 text-sm md:text-base truncate">{user.name}</p>
                    <p className="text-xs md:text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 md:px-2.5 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wide rounded-md border flex-shrink-0 ml-2 ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            ))}
            {(!users?.data || users.data.length === 0) && (
              <p className="text-center text-slate-500 py-4 text-sm">No users found</p>
            )}
          </div>
        </Card>

        <Card title="Active Contracts" subtitle="Currently running contracts">
          <div className="space-y-2 md:space-y-3">
            {contracts?.data?.filter((c) => c.status === 'ACTIVE').slice(0, 5).map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-900/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-green-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 text-sm md:text-base truncate">{contract.clientName}</p>
                    <p className="text-xs md:text-sm text-slate-500 truncate">{contract.location}</p>
                  </div>
                </div>
                <span className="px-2 md:px-2.5 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wide bg-green-900/10 text-green-800 rounded-md border border-green-800/20 flex-shrink-0 ml-2">
                  {contract.status}
                </span>
              </div>
            ))}
            {(!contracts?.data || contracts.data.filter((c) => c.status === 'ACTIVE').length === 0) && (
              <p className="text-center text-slate-500 py-4 text-sm">No active contracts</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
