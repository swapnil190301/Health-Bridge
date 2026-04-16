import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Signin from "./pages/Signin";

import UserDashboard from "./pages/UserDashboard";
import AboutDoctor from "./pages/AboutDoctor";
import AppointmentForm from "./pages/AppointmentForm";
import DoctorSchedule from "./pages/DoctorSchedule";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import AdminRoute from "./component/AdminRoute";

import DoctorRegister from "./pages/DoctorRegister";
import DoctorSignin from "./pages/DoctorSignin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRoute from "./component/DoctorRoute";

/* ✅ NEW */
import UserRoute from "./component/UserRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Patient Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />

        {/* 🔐 Patient Protected Pages */}
        <Route
          path="/user-dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        <Route
          path="/appointment"
          element={
            <UserRoute>
              <AppointmentForm />
            </UserRoute>
          }
        />

        {/* Optional: protect these if needed */}
        <Route
          path="/about-doctor"
          element={
            <UserRoute>
              <AboutDoctor />
            </UserRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <UserRoute>
              <DoctorSchedule />
            </UserRoute>
          }
        />

        {/* Doctor Authentication */}
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/doctor-signin" element={<DoctorSignin />} />

        {/* 🔐 Doctor Protected Route */}
        <Route
          path="/doctor-dashboard"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />

        {/* Admin Authentication */}
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔐 Admin Protected Route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;