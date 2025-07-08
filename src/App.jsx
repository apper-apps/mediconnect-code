import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Appointments from "@/components/pages/Appointments";
import Prescriptions from "@/components/pages/Prescriptions";
import Schedule from "@/components/pages/Schedule";
import Files from "@/components/pages/Files";
import Profile from "@/components/pages/Profile";
import Patients from "@/components/pages/Patients";
import { useUserRole } from "@/hooks/useUserRole";

function App() {
  const { userRole } = useUserRole();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Layout userRole={userRole} />}>
            <Route index element={<Dashboard userRole={userRole} />} />
            <Route path="appointments" element={<Appointments userRole={userRole} />} />
            <Route path="prescriptions" element={<Prescriptions userRole={userRole} />} />
            {userRole === "doctor" && (
              <>
                <Route path="schedule" element={<Schedule />} />
                <Route path="patients" element={<Patients />} />
              </>
            )}
            {userRole === "patient" && (
              <Route path="files" element={<Files userRole={userRole} />} />
            )}
            <Route path="profile" element={<Profile userRole={userRole} />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;