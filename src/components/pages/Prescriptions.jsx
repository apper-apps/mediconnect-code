import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import PrescriptionList from "@/components/organisms/PrescriptionList";
import PrescriptionForm from "@/components/organisms/PrescriptionForm";
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
              ? "Create and manage patient prescriptions" 
              : "View your medical prescriptions and medications"
            }
          </p>
        </div>
        
        {userRole === "doctor" && (
          <Button 
            variant="primary" 
            icon="Plus"
            onClick={handleCreateNew}
          >
            New Prescription
          </Button>
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
              <p className="text-sm font-medium text-green-800">Active Prescriptions</p>
              <p className="text-2xl font-bold text-green-900">12</p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold">A</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">This Month</p>
              <p className="text-2xl font-bold text-blue-900">8</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-semibold">M</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Templates Used</p>
              <p className="text-2xl font-bold text-purple-900">5</p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-semibold">T</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Refills Needed</p>
              <p className="text-2xl font-bold text-orange-900">3</p>
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-700 font-semibold">R</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Prescription Templates (Doctor Only) */}
      {userRole === "doctor" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Cold & Flu", icon: "🤧", color: "bg-blue-100 text-blue-700" },
              { name: "Hypertension", icon: "❤️", color: "bg-red-100 text-red-700" },
              { name: "Diabetes", icon: "🩺", color: "bg-green-100 text-green-700" },
              { name: "Antibiotics", icon: "💊", color: "bg-yellow-100 text-yellow-700" },
              { name: "Pain Relief", icon: "🔥", color: "bg-orange-100 text-orange-700" },
              { name: "Custom", icon: "✏️", color: "bg-purple-100 text-purple-700" },
            ].map((template) => (
              <button
                key={template.name}
                onClick={handleCreateNew}
                className={cn(
                  "p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md",
                  template.color
                )}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <p className="font-medium">{template.name}</p>
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