import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_LABELS } from '@/utils/constants';
import { LogOut, ChevronDown, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20';
      case 'MANAGER':
        return 'bg-[#22a855]/10 text-[#1b8a45] border-[#22a855]/20';
      case 'DRIVER':
        return 'bg-[#f59e0b]/10 text-[#d97706] border-[#f59e0b]/20';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left side - Hamburger & Welcome message */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Hamburger Button - Mobile Only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>

        <div>
          <h2 className="text-base md:text-lg font-semibold text-[#1e3a5f]">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Role Badge - Hidden on small mobile */}
        <span className={`hidden sm:inline-flex px-2 md:px-3 py-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide rounded-md border ${getRoleBadgeColor(user?.role || '')}`}>
          {user?.role && ROLE_LABELS[user.role]}
        </span>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#1e3a5f] to-[#152a45] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xs md:text-sm font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fade-in overflow-hidden">
              <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
