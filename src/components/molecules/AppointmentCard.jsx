import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AppointmentCard = ({ 
  appointment, 
  onApprove, 
  onReject, 
  onView,
  showActions = true,
  userRole = "patient",
  className,
  ...props 
}) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), "h:mm a");
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "pending";
      case "approved":
        return "approved";
      case "cancelled":
        return "cancelled";
      case "completed":
        return "completed";
      default:
        return "default";
    }
  };

  return (
    <Card
      variant="elevated"
      hover={true}
      className={cn("p-4", className)}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {userRole === "doctor" ? appointment.patientName : appointment.doctorName}
            </h3>
            <p className="text-sm text-slate-600">
              {userRole === "doctor" ? "Patient" : appointment.specialization}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(appointment.status)}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Calendar" size={14} className="mr-2" />
          {formatDate(appointment.dateTime)}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Clock" size={14} className="mr-2" />
          {formatTime(appointment.dateTime)}
        </div>
        {appointment.reason && (
          <div className="flex items-start text-sm text-slate-600">
            <ApperIcon name="FileText" size={14} className="mr-2 mt-0.5" />
            <span>{appointment.reason}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex space-x-2">
          {userRole === "doctor" && appointment.status === "pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                icon="Check"
                onClick={() => onApprove(appointment.Id)}
                className="flex-1"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="X"
                onClick={() => onReject(appointment.Id)}
                className="flex-1"
              >
                Reject
              </Button>
            </>
          )}
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              icon="Eye"
              onClick={() => onView(appointment.Id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;