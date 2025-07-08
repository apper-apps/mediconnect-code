import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const AppointmentList = ({ 
  userRole = "patient",
  filter = "all",
  className 
}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleApprove = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: "approved" });
      setAppointments(appointments.map(apt => 
        apt.Id === appointmentId ? { ...apt, status: "approved" } : apt
      ));
      toast.success("Appointment approved successfully");
    } catch (err) {
      toast.error("Failed to approve appointment");
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: "cancelled" });
      setAppointments(appointments.map(apt => 
        apt.Id === appointmentId ? { ...apt, status: "cancelled" } : apt
      ));
      toast.success("Appointment rejected");
    } catch (err) {
      toast.error("Failed to reject appointment");
    }
  };

  const handleView = (appointmentId) => {
    // Navigate to appointment details
    console.log("View appointment:", appointmentId);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || appointment.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadAppointments} 
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <SearchBar
        placeholder="Search appointments..."
        onSearch={setSearchTerm}
        showButton={false}
      />

      {filteredAppointments.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No appointments found"
          description={searchTerm ? "Try adjusting your search terms" : "No appointments scheduled yet"}
          actionText="Schedule New Appointment"
          onAction={() => console.log("Schedule new appointment")}
        />
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.Id}
              appointment={appointment}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleView}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;