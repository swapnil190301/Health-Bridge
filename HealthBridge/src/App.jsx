import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import DoctorDashboard from "./pages/DoctorDashboard";
import AboutDoctor from "./pages/AboutDoctor";
import AppointmentForm from "./pages/AppointmentForm";
import DoctorSchedule from "./pages/DoctorSchedule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />

        {/* Dashboard and subpages */}
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/dashboard/about" element={<AboutDoctor />} />
        <Route path="/dashboard/appointment" element={<AppointmentForm />} />
        <Route path="/dashboard/schedule" element={<DoctorSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
