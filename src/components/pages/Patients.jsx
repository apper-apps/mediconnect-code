import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadPatientsData();
  }, []);

  const loadPatientsData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll()
      ]);
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      toast.error("Failed to load patients data");
    } finally {
      setLoading(false);
    }
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  const getPatientStats = (patientId) => {
    const patientAppointments = getPatientAppointments(patientId);
    const completed = patientAppointments.filter(apt => apt.status === "completed").length;
    const upcoming = patientAppointments.filter(apt => 
      apt.status === "approved" && new Date(apt.dateTime) > new Date()
    ).length;
    
    return { total: patientAppointments.length, completed, upcoming };
  };

  const filteredPatients = patients.filter(patient => {
    return !searchTerm || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
  });

  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-600">
            Manage your patients and view their medical history
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="FileText">
            Export List
          </Button>
          <Button variant="primary" icon="UserPlus">
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search patients by name, email, or phone..."
        onSearch={setSearchTerm}
        showButton={false}
      />

      {/* Patient Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Patients</p>
              <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active Patients</p>
              <p className="text-2xl font-bold text-green-900">
                {patients.filter(p => getPatientStats(p.Id).upcoming > 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <ApperIcon name="UserCheck" size={20} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">New This Month</p>
              <p className="text-2xl font-bold text-purple-900">8</p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <ApperIcon name="UserPlus" size={20} className="text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Follow-ups Due</p>
              <p className="text-2xl font-bold text-orange-900">5</p>
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No patients found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first patient"}
          </p>
          <Button variant="primary" icon="UserPlus">
            Add Patient
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const stats = getPatientStats(patient.Id);
            return (
              <Card key={patient.Id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-600">{patient.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Phone" size={14} className="mr-2" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Calendar" size={14} className="mr-2" />
                    {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="MapPin" size={14} className="mr-2" />
                    {patient.address}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <p className="text-sm font-semibold text-slate-900">{stats.total}</p>
                    <p className="text-xs text-slate-600">Total</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-sm font-semibold text-green-900">{stats.completed}</p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-sm font-semibold text-blue-900">{stats.upcoming}</p>
                    <p className="text-xs text-blue-600">Upcoming</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon="FileText"
                    onClick={() => handleViewHistory(patient)}
                    className="flex-1"
                  >
                    View History
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="Calendar"
                    className="flex-1"
                  >
                    Schedule
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Patient History Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedPatient.name}</h2>
                    <p className="text-slate-600">Patient History</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedPatient(null)}
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPatient.phone}</p>
                      <p><span className="font-medium">Date of Birth:</span> {format(new Date(selectedPatient.dateOfBirth), "MMM dd, yyyy")}</p>
                      <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Medical Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Allergies:</span> {selectedPatient.allergies || "None"}</p>
                      <p><span className="font-medium">Medical History:</span> {selectedPatient.medicalHistory || "None"}</p>
                      <p><span className="font-medium">Emergency Contact:</span> {selectedPatient.emergencyContact || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-3">Appointment History</h3>
                  <div className="space-y-3">
                    {getPatientAppointments(selectedPatient.Id).map((appointment) => (
                      <div key={appointment.Id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {format(new Date(appointment.dateTime), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                            <p className="text-sm text-slate-600">{appointment.reason}</p>
                          </div>
                          <div className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            appointment.status === "completed" && "bg-green-100 text-green-800",
                            appointment.status === "approved" && "bg-blue-100 text-blue-800",
                            appointment.status === "pending" && "bg-yellow-100 text-yellow-800",
                            appointment.status === "cancelled" && "bg-red-100 text-red-800"
                          )}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Patients;