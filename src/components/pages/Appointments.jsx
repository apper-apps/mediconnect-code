import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import AppointmentList from "@/components/organisms/AppointmentList";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";

const Appointments = ({ userRole = "patient" }) => {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");

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
              ? "Manage your patient appointments and schedule" 
              : "View and manage your medical appointments"
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={view === "list" ? "primary" : "secondary"}
            size="sm"
            icon="List"
            onClick={() => setView("list")}
          >
            List View
          </Button>
          <Button
            variant={view === "calendar" ? "primary" : "secondary"}
            size="sm"
            icon="Calendar"
            onClick={() => setView("calendar")}
          >
            Calendar View
          </Button>
          {userRole === "patient" && (
            <Button variant="primary" icon="Plus">
              New Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {view === "list" && (
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
        {view === "list" ? (
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
          <div key={option.value} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{option.label}</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <Badge variant={option.color} className="ml-2">
                {option.label}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;