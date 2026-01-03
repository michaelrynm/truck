import { useAuth } from '@/features/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '@/api/drivers.api';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user } = useAuth();

  const { data: driver, isLoading } = useQuery({
    queryKey: ['driver-profile', user?.driver?.id],
    queryFn: () => driversApi.getById(user?.driver?.id || ''),
    enabled: !!user?.driver?.id,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <Card title="My Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>

          {driver && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <p className="text-gray-900">{driver.licenseNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{driver.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{driver.address}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${
                  driver.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {driver.status}
                </span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
