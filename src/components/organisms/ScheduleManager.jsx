import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { scheduleService } from "@/services/api/scheduleService";
import { toast } from "react-toastify";

const ScheduleManager = ({ className }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAll();
      
      // Convert array to object with day keys
      const scheduleObj = {};
      data.forEach(item => {
        scheduleObj[item.day] = item;
      });
      
      setSchedule(scheduleObj);
    } catch (err) {
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const toggleDayAvailability = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day]?.isAvailable,
        startTime: prev[day]?.startTime || "09:00",
        endTime: prev[day]?.endTime || "17:00",
        timeSlots: prev[day]?.timeSlots || timeSlots.slice(0, 8)
      }
    }));
  };

  const updateDaySchedule = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleTimeSlot = (day, timeSlot) => {
    setSchedule(prev => {
      const daySchedule = prev[day] || {};
      const currentSlots = daySchedule.timeSlots || [];
      const newSlots = currentSlots.includes(timeSlot)
        ? currentSlots.filter(slot => slot !== timeSlot)
        : [...currentSlots, timeSlot].sort();

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          timeSlots: newSlots
        }
      };
    });
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      
      // Convert schedule object to array format
      const scheduleArray = daysOfWeek.map(({ key, label }) => ({
        day: key,
        dayLabel: label,
        isAvailable: schedule[key]?.isAvailable || false,
        startTime: schedule[key]?.startTime || "09:00",
        endTime: schedule[key]?.endTime || "17:00",
        timeSlots: schedule[key]?.timeSlots || []
      }));

      await scheduleService.updateSchedule(scheduleArray);
      toast.success("Schedule updated successfully");
    } catch (err) {
      toast.error("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Clock" size={20} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Clinic Schedule</h2>
        </div>
        <Button
          variant="primary"
          icon="Save"
          loading={saving}
          onClick={saveSchedule}
        >
          Save Schedule
        </Button>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map(({ key, label }) => {
          const daySchedule = schedule[key] || {};
          const isAvailable = daySchedule.isAvailable || false;

          return (
            <Card key={key} className="p-4 border-2 border-dashed border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-slate-900">{label}</h3>
                  <Badge variant={isAvailable ? "success" : "default"}>
                    {isAvailable ? "Available" : "Closed"}
                  </Badge>
                </div>
                <Button
                  variant={isAvailable ? "danger" : "success"}
                  size="sm"
                  icon={isAvailable ? "X" : "Plus"}
                  onClick={() => toggleDayAvailability(key)}
                >
                  {isAvailable ? "Close" : "Open"}
                </Button>
              </div>

              {isAvailable && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Start Time
                      </label>
                      <select
                        value={daySchedule.startTime || "09:00"}
                        onChange={(e) => updateDaySchedule(key, "startTime", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {timeSlots.slice(0, 7).map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        End Time
                      </label>
                      <select
                        value={daySchedule.endTime || "17:00"}
                        onChange={(e) => updateDaySchedule(key, "endTime", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {timeSlots.slice(7).map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.map(time => {
                        const isSelected = daySchedule.timeSlots?.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => toggleTimeSlot(key, time)}
                            className={cn(
                              "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                              isSelected
                                ? "bg-primary-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Schedule Tips</h4>
            <p className="text-sm text-blue-700 mt-1">
              Configure your clinic hours and available appointment slots. 
              Patients will only be able to book appointments during your selected time slots.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleManager;