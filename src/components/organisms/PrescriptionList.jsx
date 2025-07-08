import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import PrescriptionCard from "@/components/molecules/PrescriptionCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { prescriptionService } from "@/services/api/prescriptionService";
import { toast } from "react-toastify";

const PrescriptionList = ({ 
  userRole = "patient",
  className 
}) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await prescriptionService.getAll();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleView = (prescriptionId) => {
    console.log("View prescription:", prescriptionId);
  };

  const handleEdit = (prescriptionId) => {
    console.log("Edit prescription:", prescriptionId);
  };

  const handleDelete = async (prescriptionId) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        await prescriptionService.delete(prescriptionId);
        setPrescriptions(prescriptions.filter(p => p.Id !== prescriptionId));
        toast.success("Prescription deleted successfully");
      } catch (err) {
        toast.error("Failed to delete prescription");
      }
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    return !searchTerm || 
      prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications?.some(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadPrescriptions} 
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <SearchBar
        placeholder="Search prescriptions..."
        onSearch={setSearchTerm}
        showButton={false}
      />

      {filteredPrescriptions.length === 0 ? (
        <Empty
          icon="Pill"
          title="No prescriptions found"
          description={searchTerm ? "Try adjusting your search terms" : "No prescriptions available"}
          actionText={userRole === "doctor" ? "Create New Prescription" : "Contact Doctor"}
          onAction={() => console.log("Create new prescription")}
        />
      ) : (
        <div className="grid gap-4">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.Id}
              prescription={prescription}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;