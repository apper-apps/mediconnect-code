import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import StatCard from "@/components/molecules/StatCard";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { prescriptionService } from "@/services/api/prescriptionService";
import { patientService } from "@/services/api/patientService";
import { format } from "date-fns";
const Dashboard = ({ userRole = "patient" }) => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalPrescriptions: 0,
    totalPatients: 0,
    todayAppointments: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load different data based on user role
      const dataPromises = [
        appointmentService.getAll(),
        prescriptionService.getAll()
      ];
      
      // Add patient data for doctors
      if (userRole === "doctor") {
        dataPromises.push(patientService.getAll());
      }
      
      const results = await Promise.all(dataPromises);
      const [appointmentsData, prescriptionsData, patientsData] = results;

      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
      if (patientsData) {
        setPatients(patientsData);
      }

      // Calculate stats based on user role
      const pendingCount = appointmentsData.filter(apt => apt.status === "pending").length;
      const completedCount = appointmentsData.filter(apt => apt.status === "completed").length;
      
      // Calculate today's appointments
      const today = new Date();
      const todayCount = appointmentsData.filter(apt => {
        const appointmentDate = new Date(apt.dateTime);
        return appointmentDate.toDateString() === today.toDateString();
      }).length;

      setStats({
        totalAppointments: appointmentsData.length,
        pendingAppointments: pendingCount,
        completedAppointments: completedCount,
        totalPrescriptions: prescriptionsData.length,
        totalPatients: patientsData ? patientsData.length : 0,
        todayAppointments: todayCount,
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.dateTime);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 3);

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const patientStats = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: "Calendar",
      color: "primary",
      trend: "neutral",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: "Clock",
      color: "warning",
      trend: "neutral",
    },
    {
      title: "Completed Visits",
      value: stats.completedAppointments,
      icon: "CheckCircle",
      color: "success",
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Active Prescriptions",
      value: stats.totalPrescriptions,
      icon: "Pill",
      color: "purple",
      trend: "neutral",
    },
  ];

const doctorStats = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: "Calendar",
      color: "primary",
      trend: "neutral",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: "Users", 
      color: "success",
      trend: "up",
      trendValue: "+5%",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingAppointments,
      icon: "Clock",
      color: "warning",
      trend: "neutral",
    },
    {
      title: "Prescriptions Issued",
      value: stats.totalPrescriptions,
      icon: "Pill",
      color: "purple",
      trend: "up",
      trendValue: "+15%",
    },
  ];

  const currentStats = userRole === "doctor" ? doctorStats : patientStats;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

return (
    <div className="space-y-6">
      {/* Welcome Section */}
<Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary-900 mb-2">
              Welcome back, {userRole === "doctor" ? "Dr. Sarah Johnson" : "John Smith"}!
            </h1>
            <p className="text-primary-700 mb-4">
              {userRole === "doctor" 
                ? `You have ${stats.todayAppointments} appointments scheduled for today and ${stats.totalPatients} patients under your care`
                : `You have ${upcomingAppointments.length} upcoming appointments and ${stats.totalPrescriptions} active prescriptions`
              }
            </p>
            {userRole === "doctor" ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-primary-600">
                <span className="font-medium">Internal Medicine</span>
                <span className="hidden sm:inline">•</span>
                <span>MediConnect Health Center</span>
                <span className="hidden sm:inline">•</span>
                <span>License #MD-2024-1234</span>
              </div>
            ) : (
              <div className="text-sm text-primary-600">
                Patient ID: PT-2024-5678 • Next appointment: {upcomingAppointments.length > 0 ? format(new Date(upcomingAppointments[0].dateTime), "MMM dd, yyyy") : "None scheduled"}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name={userRole === "doctor" ? "Stethoscope" : "Heart"} size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary-800">
                {userRole === "doctor" ? "Today's Schedule" : "Health Status"}
              </p>
              <p className="text-lg font-bold text-primary-900">
                {userRole === "doctor" 
                  ? new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : "Good"
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's/Upcoming Appointments */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {userRole === "doctor" ? "Today's Schedule" : "Upcoming Appointments"}
            </h2>
            <Button variant="secondary" size="sm" icon="Calendar">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {(userRole === "doctor" ? todayAppointments : upcomingAppointments).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Calendar" size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-600">
                  {userRole === "doctor" ? "No appointments scheduled for today" : "No upcoming appointments"}
                </p>
              </div>
            ) : (
              (userRole === "doctor" ? todayAppointments : upcomingAppointments).map((appointment) => (
                <AppointmentCard
                  key={appointment.Id}
                  appointment={appointment}
                  userRole={userRole}
                  showActions={userRole === "doctor"}
                />
              ))
            )}
          </div>
        </Card>

{/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
<div className="space-y-3">
              {userRole === "doctor" ? (
                <>
                  <Button variant="primary" className="w-full" icon="Plus">
                    New Appointment
                  </Button>
                  <Button variant="secondary" className="w-full" icon="Pill">
                    Create Prescription
                  </Button>
                  <Button variant="outline" className="w-full" icon="Users">
                    Manage Patients
                  </Button>
                  <Button variant="outline" className="w-full" icon="Clock">
                    Schedule Management
                  </Button>
                  <Button variant="ghost" className="w-full" icon="FileText">
                    Medical Records
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" className="w-full" icon="Calendar">
                    Book Appointment
                  </Button>
                  <Button variant="secondary" className="w-full" icon="Upload">
                    Upload Medical Files
                  </Button>
                  <Button variant="outline" className="w-full" icon="Pill">
                    View Prescriptions
                  </Button>
                  <Button variant="ghost" className="w-full" icon="User">
                    Update Profile
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Recent Prescriptions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Prescriptions</h3>
              <Button variant="ghost" size="sm" icon="ArrowRight">
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentPrescriptions.length === 0 ? (
                <div className="text-center py-4">
                  <ApperIcon name="Pill" size={24} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">No recent prescriptions</p>
                </div>
              ) : (
                recentPrescriptions.map((prescription) => (
                  <div key={prescription.Id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Pill" size={14} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {userRole === "doctor" ? prescription.patientName : prescription.doctorName}
                      </p>
                      <p className="text-xs text-slate-600">
                        {format(new Date(prescription.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;