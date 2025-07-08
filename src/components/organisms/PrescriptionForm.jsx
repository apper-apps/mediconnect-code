import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { prescriptionService } from "@/services/api/prescriptionService";
import { toast } from "react-toastify";

const PrescriptionForm = ({ 
  prescriptionId = null,
  onSuccess,
  className 
}) => {
  const [formData, setFormData] = useState({
    patientName: "",
    templateUsed: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  const prescriptionTemplates = [
    {
      value: "cold_flu",
      label: "Cold & Flu",
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", duration: "5 days" },
        { name: "Cough Syrup", dosage: "10ml", frequency: "Three times daily", duration: "7 days" }
      ],
      instructions: "Take with food. Rest and drink plenty of fluids."
    },
    {
      value: "hypertension",
      label: "Hypertension",
      medications: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days" },
        { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", duration: "30 days" }
      ],
      instructions: "Take at the same time each day. Monitor blood pressure regularly."
    },
    {
      value: "diabetes",
      label: "Diabetes",
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days" },
        { name: "Glipizide", dosage: "5mg", frequency: "Once daily", duration: "30 days" }
      ],
      instructions: "Take with meals. Monitor blood sugar levels regularly."
    },
    {
      value: "antibiotics",
      label: "Antibiotics",
      medications: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days" },
        { name: "Probiotics", dosage: "1 capsule", frequency: "Once daily", duration: "14 days" }
      ],
      instructions: "Complete the full course. Take probiotics to maintain gut health."
    },
    {
      value: "pain_relief",
      label: "Pain Relief",
      medications: [
        { name: "Ibuprofen", dosage: "400mg", frequency: "Three times daily", duration: "5 days" },
        { name: "Muscle Relaxant", dosage: "10mg", frequency: "Twice daily", duration: "7 days" }
      ],
      instructions: "Take with food. Apply ice/heat as needed. Avoid driving if drowsy."
    }
  ];

  useEffect(() => {
    if (prescriptionId) {
      loadPrescription();
    }
  }, [prescriptionId]);

  const loadPrescription = async () => {
    try {
      setLoading(true);
      const prescription = await prescriptionService.getById(prescriptionId);
      setFormData(prescription);
    } catch (err) {
      toast.error("Failed to load prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateValue) => {
    if (!templateValue) {
      setFormData({ ...formData, templateUsed: "" });
      return;
    }

    setTemplateLoading(true);
    const template = prescriptionTemplates.find(t => t.value === templateValue);
    
    if (template) {
      setFormData({
        ...formData,
        templateUsed: template.label,
        medications: template.medications,
        instructions: template.instructions,
      });
    }
    
    setTimeout(() => setTemplateLoading(false), 500);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", dosage: "", frequency: "", duration: "" }]
    });
  };

  const removeMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || formData.medications.some(m => !m.name)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const prescriptionData = {
        ...formData,
        createdAt: new Date().toISOString(),
        doctorName: "Dr. Sarah Johnson",
        appointmentId: 1,
      };

      if (prescriptionId) {
        await prescriptionService.update(prescriptionId, prescriptionData);
        toast.success("Prescription updated successfully");
      } else {
        await prescriptionService.create(prescriptionData);
        toast.success("Prescription created successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <ApperIcon name="Pill" size={20} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          {prescriptionId ? "Edit Prescription" : "New Prescription"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Patient Name"
            type="text"
            value={formData.patientName}
            onChange={(e) => handleInputChange("patientName", e.target.value)}
            required
            placeholder="Enter patient name"
          />

          <FormField
            label="Template"
            type="select"
            value={formData.templateUsed}
            onChange={(e) => handleTemplateChange(e.target.value)}
            options={[
              { value: "", label: "Select a template (optional)" },
              ...prescriptionTemplates.map(t => ({ value: t.value, label: t.label }))
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-900">Medications</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon="Plus"
              onClick={addMedication}
            >
              Add Medication
            </Button>
          </div>

          {templateLoading ? (
            <div className="flex items-center justify-center py-8">
              <ApperIcon name="Loader2" size={24} className="animate-spin text-primary-600" />
              <span className="ml-2 text-slate-600">Loading template...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <Card key={index} className="p-4 border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-slate-700">
                      Medication {index + 1}
                    </h4>
                    {formData.medications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="X"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Medication Name"
                      type="text"
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                      required
                      placeholder="Enter medication name"
                    />
                    <FormField
                      label="Dosage"
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                    <FormField
                      label="Frequency"
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                    <FormField
                      label="Duration"
                      type="text"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                      placeholder="e.g., 7 days"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <FormField
          label="Instructions"
          type="textarea"
          value={formData.instructions}
          onChange={(e) => handleInputChange("instructions", e.target.value)}
          placeholder="Enter special instructions for the patient"
          rows={4}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            icon="Save"
            loading={loading}
            className="flex-1"
          >
            {prescriptionId ? "Update Prescription" : "Create Prescription"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon="X"
            onClick={() => onSuccess && onSuccess()}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;