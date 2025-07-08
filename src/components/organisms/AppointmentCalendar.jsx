import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { appointmentService } from "@/services/api/appointmentService";

const AppointmentCalendar = ({ 
  userRole = "patient",
  onDateSelect,
  onAppointmentSelect,
  className 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.dateTime), date)
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const getDayClasses = (date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const dayAppointments = getAppointmentsForDay(date);
    const hasAppointments = dayAppointments.length > 0;

    return cn(
      "calendar-day",
      !isCurrentMonth && "text-slate-300",
      isToday(date) && "today",
      isSelected && "selected",
      hasAppointments && "font-semibold"
    );
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <h2 className="text-lg font-semibold text-slate-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date) => {
            const dayAppointments = getAppointmentsForDay(date);
            return (
              <div
                key={date.toString()}
                className={getDayClasses(date)}
                onClick={() => handleDateClick(date)}
              >
                <span>{format(date, "d")}</span>
                {dayAppointments.length > 0 && (
                  <div className="flex justify-center mt-1">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <Badge variant="primary">
              {selectedDayAppointments.length} Appointment{selectedDayAppointments.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {selectedDayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calendar" size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 mb-4">No appointments scheduled for this day</p>
              {userRole === "patient" && (
                <Button variant="primary" icon="Plus">
                  Schedule Appointment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.Id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => onAppointmentSelect && onAppointmentSelect(appointment)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Clock" size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {format(new Date(appointment.dateTime), "h:mm a")}
                      </p>
                      <p className="text-sm text-slate-600">
                        {userRole === "doctor" ? appointment.patientName : appointment.doctorName}
                      </p>
                    </div>
                  </div>
                  <Badge variant={appointment.status}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Available Time Slots (for booking) */}
      {userRole === "patient" && selectedDate && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const isBooked = selectedDayAppointments.some(apt => 
                format(new Date(apt.dateTime), "HH:mm") === time
              );
              return (
                <Button
                  key={time}
                  variant={isBooked ? "outline" : "secondary"}
                  size="sm"
                  disabled={isBooked}
                  className={cn(
                    "justify-center",
                    isBooked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentCalendar;