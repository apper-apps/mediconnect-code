import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const PrescriptionCard = ({ 
  prescription, 
  onView,
  onEdit,
  onDelete,
  showActions = true,
  userRole = "patient",
  className,
  ...props 
}) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
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
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Pill" size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {userRole === "doctor" ? prescription.patientName : prescription.doctorName}
            </h3>
            <p className="text-sm text-slate-600">
              {formatDate(prescription.createdAt)}
            </p>
          </div>
        </div>
        {prescription.templateUsed && (
          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {prescription.templateUsed}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-slate-600">
          <span className="font-medium">Medications:</span>
          <div className="mt-1 space-y-1">
            {prescription.medications.map((medication, index) => (
              <div key={index} className="flex items-center text-sm">
                <ApperIcon name="Pill" size={12} className="mr-2 text-slate-400" />
                <span>{medication.name} - {medication.dosage}</span>
              </div>
            ))}
          </div>
        </div>
        {prescription.instructions && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">Instructions:</span>
            <p className="mt-1 text-sm">{prescription.instructions}</p>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex space-x-2">
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              icon="Eye"
              onClick={() => onView(prescription.Id)}
              className="flex-1"
            >
              View
            </Button>
          )}
          {userRole === "doctor" && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit(prescription.Id)}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          {userRole === "doctor" && onDelete && (
            <Button
              variant="danger"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete(prescription.Id)}
              className="flex-1"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default PrescriptionCard;