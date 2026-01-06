import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  Calendar,
  ClipboardList,
  BarChart3,
  UserCircle,
  X,
} from "lucide-react";
import Logo from "../public/logo.jpeg";

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isMobileOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/trucks", label: "Trucks", icon: Truck },
    { to: "/admin/contracts", label: "Contracts", icon: FileText },
    { to: "/admin/schedules", label: "Schedules", icon: Calendar },
    { to: "/admin/activities", label: "Activities", icon: ClipboardList },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  const managerLinks = [
    { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manager/trucks", label: "Trucks", icon: Truck },
    { to: "/manager/contracts", label: "Contracts", icon: FileText },
    { to: "/manager/schedules", label: "Schedules", icon: Calendar },
    { to: "/manager/activities", label: "Activities", icon: ClipboardList },
    { to: "/manager/reports", label: "Reports", icon: BarChart3 },
  ];

  const driverLinks = [
    { to: "/driver/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/driver/schedule", label: "My Schedule", icon: Calendar },
    { to: "/driver/activities", label: "My Activities", icon: ClipboardList },
    { to: "/driver/profile", label: "Profile", icon: UserCircle },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "ADMIN":
        return adminLinks;
      case "MANAGER":
        return managerLinks;
      case "DRIVER":
        return driverLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gradient-to-b from-[#1e3a5f] to-[#152a45]
        flex flex-col shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo/Brand Section */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#2d4a6f]/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
            <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              TruckFlow
            </h1>
            <p className="text-[11px] text-[#8fa3bf]">Management System</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden text-white hover:bg-[#2d4a6f]/60 p-2 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-3">
          <p className="px-3 text-[10px] font-semibold text-[#5d7a9a] uppercase tracking-widest">
            Menu
          </p>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-[#22a855] text-white shadow-lg shadow-[#22a855]/20"
                    : "text-[#a8bcd4] hover:bg-[#2d4a6f]/60 hover:text-white"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] mr-3 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer/Version */}
      <div className="px-5 py-4 border-t border-[#2d4a6f]/50">
        <p className="text-[10px] text-[#5d7a9a]">Version 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
