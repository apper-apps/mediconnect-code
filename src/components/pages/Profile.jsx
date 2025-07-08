import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Profile = ({ userRole = "patient" }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: userRole === "doctor" ? "Dr. Sarah Johnson" : "John Doe",
    email: userRole === "doctor" ? "sarah.johnson@mediconnect.com" : "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Health Street, Medical City, MC 12345",
    dateOfBirth: "1985-03-15",
    gender: "female",
    // Doctor specific fields
    specialization: "Internal Medicine",
    license: "MD12345",
    experience: "10 years",
    // Patient specific fields
    emergencyContact: "Jane Doe - (555) 987-6543",
    insuranceProvider: "HealthCare Plus",
    allergies: "Penicillin, Shellfish",
    medicalHistory: "Hypertension, Type 2 Diabetes",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-600">
            Manage your personal information and preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <Button
                variant="secondary"
                icon="X"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon="Save"
                loading={saving}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              icon="Edit"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-900">{formData.name}</h2>
            <p className="text-primary-700">{formData.email}</p>
            <p className="text-sm text-primary-600">
              {userRole === "doctor" ? formData.specialization : "Patient"}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <FormField
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!editing}
            />
            
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!editing}
            />
            
            <FormField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!editing}
            />
            
            <FormField
              label="Address"
              type="textarea"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!editing}
              rows={3}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                disabled={!editing}
              />
              
              <FormField
                label="Gender"
                type="select"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                disabled={!editing}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Professional/Medical Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name={userRole === "doctor" ? "Stethoscope" : "Heart"} size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {userRole === "doctor" ? "Professional Information" : "Medical Information"}
            </h3>
          </div>

          <div className="space-y-4">
            {userRole === "doctor" ? (
              <>
                <FormField
                  label="Specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  disabled={!editing}
                />
                
                <FormField
                  label="License Number"
                  type="text"
                  value={formData.license}
                  onChange={(e) => handleInputChange("license", e.target.value)}
                  disabled={!editing}
                />
                
                <FormField
                  label="Years of Experience"
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  disabled={!editing}
                />
              </>
            ) : (
              <>
                <FormField
                  label="Emergency Contact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  disabled={!editing}
                />
                
                <FormField
                  label="Insurance Provider"
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                  disabled={!editing}
                />
                
                <FormField
                  label="Allergies"
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  disabled={!editing}
                />
                
                <FormField
                  label="Medical History"
                  type="textarea"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  disabled={!editing}
                  rows={3}
                />
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Shield" size={20} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="secondary" icon="Key" className="justify-start">
            Change Password
          </Button>
          <Button variant="secondary" icon="Smartphone" className="justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="secondary" icon="Download" className="justify-start">
            Download My Data
          </Button>
          <Button variant="secondary" icon="Settings" className="justify-start">
            Privacy Settings
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900">Account Actions</h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-red-700">
            These actions will permanently affect your account. Please proceed with caution.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Deactivate Account
            </Button>
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;