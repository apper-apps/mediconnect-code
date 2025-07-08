import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title = "Dashboard", 
  userRole = "patient",
  onMenuClick,
  className 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: "Appointment Reminder", message: "Your appointment is tomorrow at 10:00 AM", time: "2 hours ago" },
    { id: 2, title: "Prescription Ready", message: "Your prescription is ready for pickup", time: "1 day ago" },
    { id: 3, title: "New Test Results", message: "Your lab results are now available", time: "3 days ago" },
  ];

  const userData = {
    name: userRole === "doctor" ? "Dr. Sarah Johnson" : "John Doe",
    email: userRole === "doctor" ? "sarah.johnson@mediconnect.com" : "john.doe@email.com",
    role: userRole,
    avatar: null,
  };

  return (
    <header className={cn(
      "bg-white border-b border-slate-200 px-4 py-4 lg:px-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                      <h4 className="font-medium text-slate-900 text-sm">{notification.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700">
                {userData.name}
              </span>
              <ApperIcon name="ChevronDown" size={16} className="text-slate-500" />
            </Button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{userData.name}</h3>
                      <p className="text-sm text-slate-600">{userData.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start" icon="User">
                    Profile Settings
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" icon="Settings">
                    Preferences
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" icon="HelpCircle">
                    Help & Support
                  </Button>
                  <hr className="my-2" />
                  <Button variant="ghost" size="sm" className="w-full justify-start text-red-600" icon="LogOut">
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;