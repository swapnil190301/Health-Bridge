import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./css/DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const closeMenu = () => setMenuOpen(false);

  const getMenuClass = ({ isActive }) =>
    isActive ? "menu-item active" : "menu-item";

  return (
    <div className="dashboard-wrapper">
      <button
        className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-top">
            <div className="logo-circle">
              <img
                src="/logo.png"
                alt="Health Bridge Logo"
                className="logo-img"
              />
            </div>

            <div className="brand-text">
              <h2>Health Bridge</h2>
              <p>Doctor Panel</p>
            </div>
          </div>

          <nav className="menu">
            <NavLink
              to="/dashboard"
              className={getMenuClass}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/about-doctor"
              className={getMenuClass}
              onClick={closeMenu}
            >
              Doctor Profile
            </NavLink>

            <NavLink
              to="/schedule"
              className={getMenuClass}
              onClick={closeMenu}
            >
              Schedule
            </NavLink>

            <NavLink
              to="/appointment"
              className={getMenuClass}
              onClick={closeMenu}
            >
              Appointments
            </NavLink>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </aside>

      <main className="main-section">
        <div className="topbar">
          <p className="welcome-tag">Welcome back</p>
          <h1 className="title">Doctor Dashboard</h1>
          <p className="subtitle">
            Manage appointments, availability, and your profile in one place.
          </p>
        </div>

        <section className="hero-card">
          <div className="hero-text">
            <span className="hero-badge">Smart Appointment Management</span>

            <h2>Make your schedule clean, fast, and organized.</h2>

            <p>
              View appointments, update your available time slots, and keep your
              practice running smoothly with a modern premium dashboard.
            </p>

            <div className="btn-group">
              <button
                className="primary-btn"
                onClick={() => navigate("/appointment")}
              >
                Book Appointment
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/schedule")}
              >
                View Availability
              </button>
            </div>
          </div>

          <div className="hero-image-card">
            <div className="hero-image-glow"></div>
            <img
              src="/doctor.jpg"
              alt="Doctor Illustration"
              className="doctor-image"
            />
          </div>
        </section>

        <section className="stats-grid">
          <div className="info-card">
            <h3>Appointments</h3>
            <p>Check and manage all booked appointments quickly.</p>
          </div>

          <div className="info-card">
            <h3>Schedule</h3>
            <p>Update your available dates and time slots easily.</p>
          </div>

          <div className="info-card">
            <h3>Profile</h3>
            <p>Keep your doctor information updated and professional.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;