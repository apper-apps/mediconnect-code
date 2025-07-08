import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import AppointmentList from "@/components/organisms/AppointmentList";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Schedule from "@/components/pages/Schedule";

const Appointments = ({ userRole }) => {
  const [currentView, setCurrentView] = useState('list');
  const [filter, setFilter] = useState('all');
  const filterOptions = [
    { value: "all", label: "All Appointments", color: "default" },
    { value: "pending", label: "Pending", color: "warning" },
    { value: "approved", label: "Approved", color: "success" },
    { value: "completed", label: "Completed", color: "primary" },
    { value: "cancelled", label: "Cancelled", color: "danger" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-600">
            {userRole === "doctor" 
              ? "Manage patient appointments, approvals, and scheduling workflow" 
              : "View and manage your medical appointments"
            }
          </p>
        </div>
        
<div className="flex items-center space-x-3">
          <Button
            variant={currentView === "list" ? "primary" : "secondary"}
            size="sm"
            icon="List"
            onClick={() => setCurrentView("list")}
          >
            List View
          </Button>
          <Button
            variant={currentView === "calendar" ? "primary" : "secondary"}
            size="sm"
            icon="Calendar"
            onClick={() => setCurrentView("calendar")}
          >
            Calendar View
          </Button>
{userRole === "patient" ? (
            <Button variant="primary" icon="Plus">
              Book Appointment
            </Button>
          ) : (
            <Button variant="primary" icon="Calendar">
              Schedule Patient
            </Button>
          )}
        </div>
      </div>

{/* Filters */}
      {currentView === "list" && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                filter === option.value
                  ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

{/* Main Content */}
      <div className="min-h-[400px]">
        {currentView === "list" ? (
          <AppointmentList userRole={userRole} filter={filter} />
        ) : (
          <AppointmentCalendar 
            userRole={userRole}
            onDateSelect={(date) => console.log("Selected date:", date)}
            onAppointmentSelect={(appointment) => console.log("Selected appointment:", appointment)}
          />
        )}
      </div>

{/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {filterOptions.slice(1).map((option) => (
          <Card key={option.value} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{option.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userRole === "doctor" ? 
                    (option.value === "pending" ? "8" : 
                     option.value === "approved" ? "12" : 
                     option.value === "completed" ? "156" : "3") : "0"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {userRole === "doctor" ? "Total managed" : "Your appointments"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                <ApperIcon 
                  name={option.value === "pending" ? "Clock" : 
                        option.value === "approved" ? "CheckCircle" : 
                        option.value === "completed" ? "Check" : "X"} 
                  size={20} 
                  className="text-slate-600" 
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Appointments;