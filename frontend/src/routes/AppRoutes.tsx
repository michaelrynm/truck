import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/layouts/DashboardLayout';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import TrucksPage from '@/pages/admin/TrucksPage';
import ContractsPage from '@/pages/admin/ContractsPage';
import SchedulesPage from '@/pages/admin/SchedulesPage';
import ActivitiesPage from '@/pages/admin/ActivitiesPage';
import ReportsPage from '@/pages/admin/ReportsPage';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerTrucksPage from '@/pages/manager/TrucksPage';
import ManagerContractsPage from '@/pages/manager/ContractsPage';
import ManagerSchedulesPage from '@/pages/manager/SchedulesPage';
import ManagerActivitiesPage from '@/pages/manager/ActivitiesPage';
import ManagerReportsPage from '@/pages/manager/ReportsPage';

// Driver Pages
import DriverDashboard from '@/pages/driver/DriverDashboard';
import DriverSchedulePage from '@/pages/driver/SchedulePage';
import DriverActivitiesPage from '@/pages/driver/ActivitiesPage';
import DriverProfilePage from '@/pages/driver/ProfilePage';

// Component for handling default redirect based on auth state
const DefaultRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-900"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage />
          ) : (
            <Navigate to={`/${user?.role.toLowerCase()}/dashboard`} replace />
          )
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/trucks" element={<TrucksPage />} />
            <Route path="/admin/contracts" element={<ContractsPage />} />
            <Route path="/admin/schedules" element={<SchedulesPage />} />
            <Route path="/admin/activities" element={<ActivitiesPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/trucks" element={<ManagerTrucksPage />} />
            <Route path="/manager/contracts" element={<ManagerContractsPage />} />
            <Route path="/manager/schedules" element={<ManagerSchedulesPage />} />
            <Route path="/manager/activities" element={<ManagerActivitiesPage />} />
            <Route path="/manager/reports" element={<ManagerReportsPage />} />
          </Route>

          {/* Driver Routes */}
          <Route element={<RoleRoute allowedRoles={['DRIVER']} />}>
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/schedule" element={<DriverSchedulePage />} />
            <Route path="/driver/activities" element={<DriverActivitiesPage />} />
            <Route path="/driver/profile" element={<DriverProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect - handles "/" and any unmatched routes */}
      <Route path="/" element={<DefaultRedirect />} />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
