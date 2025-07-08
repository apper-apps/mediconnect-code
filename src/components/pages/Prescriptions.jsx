import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import PrescriptionList from "@/components/organisms/PrescriptionList";
import PrescriptionForm from "@/components/organisms/PrescriptionForm";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Prescriptions = ({ userRole = "patient" }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  const handleCreateNew = () => {
    setEditingPrescription(null);
    setShowForm(true);
  };

  const handleEdit = (prescriptionId) => {
    setEditingPrescription(prescriptionId);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPrescription(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
          <p className="text-sm text-slate-600">
            {userRole === "doctor" 
              ? "Create and manage patient prescriptions with templates and tracking" 
              : "View your medical prescriptions and medications"
            }
          </p>
        </div>
        
        {userRole === "doctor" && (
          <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              icon="FileText"
            >
              Export Records
            </Button>
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={handleCreateNew}
            >
              New Prescription
            </Button>
          </div>
        )}
      </div>

      {/* Form Modal/Card */}
      {showForm && (
        <Card className="border-2 border-primary-200 bg-primary-50">
          <PrescriptionForm
            prescriptionId={editingPrescription}
            onSuccess={handleFormSuccess}
          />
        </Card>
      )}

{/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                {userRole === "doctor" ? "Total Prescribed" : "Active Prescriptions"}
              </p>
              <p className="text-2xl font-bold text-green-900">
                {userRole === "doctor" ? "47" : "12"}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Pill" size={20} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">This Month</p>
              <p className="text-2xl font-bold text-blue-900">
                {userRole === "doctor" ? "23" : "8"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">
                {userRole === "doctor" ? "Active Patients" : "Templates Used"}
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {userRole === "doctor" ? "15" : "5"}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <ApperIcon name={userRole === "doctor" ? "Users" : "FileText"} size={20} className="text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">
                {userRole === "doctor" ? "Pending Reviews" : "Refills Needed"}
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {userRole === "doctor" ? "6" : "3"}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <ApperIcon name={userRole === "doctor" ? "Clock" : "RefreshCw"} size={20} className="text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

{/* Prescription Templates (Doctor Only) */}
      {userRole === "doctor" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Quick Templates</h3>
            <Button variant="ghost" size="sm" icon="Settings">
              Manage Templates
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Cold & Flu", icon: "Thermometer", color: "bg-blue-100 text-blue-700 border-blue-200", usage: "45 uses" },
              { name: "Hypertension", icon: "Heart", color: "bg-red-100 text-red-700 border-red-200", usage: "32 uses" },
              { name: "Diabetes", icon: "Activity", color: "bg-green-100 text-green-700 border-green-200", usage: "28 uses" },
              { name: "Antibiotics", icon: "Shield", color: "bg-yellow-100 text-yellow-700 border-yellow-200", usage: "21 uses" },
              { name: "Pain Relief", icon: "Zap", color: "bg-orange-100 text-orange-700 border-orange-200", usage: "19 uses" },
              { name: "Custom", icon: "Plus", color: "bg-purple-100 text-purple-700 border-purple-200", usage: "Create new" },
            ].map((template) => (
              <button
                key={template.name}
                onClick={handleCreateNew}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md hover:scale-105",
                  template.color
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white mb-3 mx-auto">
                  <ApperIcon name={template.icon} size={20} />
                </div>
                <p className="font-medium mb-1">{template.name}</p>
                <p className="text-xs opacity-75">{template.usage}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Prescription List */}
      <PrescriptionList userRole={userRole} />
    </div>
  );
};

export default Prescriptions;