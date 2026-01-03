import { useState, FormEvent } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Truck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TruckFlow</h1>
              <p className="text-sm text-slate-400">Management System</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Streamline your fleet<br />operations with ease
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Complete solution for managing dump trucks, drivers, schedules, and contracts in one centralized platform.
          </p>
          <div className="flex space-x-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-slate-400">Active Trucks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1,200+</p>
              <p className="text-sm text-slate-400">Trips Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-slate-400">On-Time Rate</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          2024 TruckFlow Management. Enterprise Solution.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">TruckFlow</h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-1">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />

              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-3">Demo Credentials</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Admin</p>
                    <p className="text-xs text-slate-500">admin@dumptruck.com</p>
                  </div>
                  <span className="text-xs text-slate-400">password123</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Manager</p>
                    <p className="text-xs text-slate-500">manager1@dumptruck.com</p>
                  </div>
                  <span className="text-xs text-slate-400">password123</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Driver</p>
                    <p className="text-xs text-slate-500">driver1@dumptruck.com</p>
                  </div>
                  <span className="text-xs text-slate-400">password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
