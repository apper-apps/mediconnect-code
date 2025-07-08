import React from "react";
import { cn } from "@/utils/cn";
import NavLink from "@/components/molecules/NavLink";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ 
  userRole = "patient",
  isOpen = false,
  onClose,
  className 
}) => {
  const patientNavItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/appointments", icon: "Calendar", label: "Appointments" },
    { to: "/prescriptions", icon: "Pill", label: "Prescriptions" },
    { to: "/files", icon: "FileText", label: "Medical Files" },
    { to: "/profile", icon: "User", label: "Profile" },
  ];

  const doctorNavItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/appointments", icon: "Calendar", label: "Appointments" },
    { to: "/prescriptions", icon: "Pill", label: "Prescriptions" },
    { to: "/schedule", icon: "Clock", label: "Schedule" },
    { to: "/patients", icon: "Users", label: "Patients" },
  ];

  const navItems = userRole === "doctor" ? doctorNavItems : patientNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block w-64 bg-white border-r border-slate-200 h-screen sticky top-0",
        className
      )}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">MediConnect</h2>
              <p className="text-sm text-slate-600 capitalize">{userRole} Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">MediConnect</h2>
                <p className="text-sm text-slate-600 capitalize">{userRole} Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;