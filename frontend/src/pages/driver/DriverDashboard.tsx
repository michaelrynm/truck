import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { schedulesApi } from '@/api/schedules.api';
import { activitiesApi } from '@/api/activities.api';
import { formatDate } from '@/utils/formatters';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Calendar, ClipboardList, Truck, Package } from 'lucide-react';

const DriverDashboard = () => {
  const { user } = useAuth();

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['my-schedules'],
    queryFn: () => schedulesApi.getMySchedules(),
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['my-activities'],
    queryFn: () => activitiesApi.getMyActivities(),
  });

  if (schedulesLoading || activitiesLoading) {
    return <LoadingSpinner />;
  }

  const todaySchedules = schedules?.data?.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  ) || [];

  const recentActivities = activities?.data?.slice(0, 5) || [];

  const stats = [
    {
      title: "Today's Schedules",
      value: todaySchedules.length,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Total Schedules',
      value: schedules?.data?.length || 0,
      icon: Truck,
      color: 'green',
    },
    {
      title: 'Total Activities',
      value: activities?.data?.length || 0,
      icon: ClipboardList,
      color: 'orange',
    },
    {
      title: 'Total Loads',
      value: activities?.data?.reduce((sum, a) => sum + a.numberOfLoads, 0) || 0,
      icon: Package,
      color: 'slate',
    },
  ];

  const iconColors = {
    blue: 'bg-blue-900/10 text-blue-800',
    green: 'bg-green-900/10 text-green-800',
    orange: 'bg-orange-900/10 text-orange-800',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Here's your schedule and activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white border border-slate-200 rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors[stat.color as keyof typeof iconColors]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Schedules" subtitle="Your trips for today">
          {todaySchedules.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No schedules for today</p>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-900/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-800" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{schedule.contract?.clientName || 'N/A'}</p>
                      <p className="text-sm text-slate-500">{schedule.dumpTruck?.plateNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wide bg-blue-900/10 text-blue-800 rounded-md border border-blue-800/20">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent Activities" subtitle="Your latest activity logs">
          {recentActivities.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-900/10 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-green-800" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{formatDate(activity.date)}</p>
                      <p className="text-sm text-slate-500">{activity.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wide bg-green-900/10 text-green-800 rounded-md border border-green-800/20">
                    {activity.numberOfLoads} loads
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
