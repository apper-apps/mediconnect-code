import React from "react";
import { cn } from "@/utils/cn";
import ScheduleManager from "@/components/organisms/ScheduleManager";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Schedule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinic Schedule</h1>
          <p className="text-sm text-slate-600">
            Configure your clinic hours and available appointment slots
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export Schedule
          </Button>
          <Button variant="primary" icon="Settings">
            Schedule Settings
          </Button>
        </div>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-800">Weekly Hours</p>
              <p className="text-2xl font-bold text-primary-900">40</p>
              <p className="text-xs text-primary-700">5 days active</p>
            </div>
            <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-primary-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Available Slots</p>
              <p className="text-2xl font-bold text-green-900">120</p>
              <p className="text-xs text-green-700">per week</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Booked Today</p>
              <p className="text-2xl font-bold text-purple-900">8</p>
              <p className="text-xs text-purple-700">of 16 slots</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Manager */}
      <ScheduleManager />

      {/* Schedule Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" size={20} className="text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Schedule Management Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set realistic time slots to avoid patient waiting</li>
              <li>• Leave buffer time between appointments for documentation</li>
              <li>• Consider lunch breaks and emergency slots in your schedule</li>
              <li>• Update your schedule regularly to reflect changes</li>
              <li>• Use templates to quickly set up recurring schedules</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;