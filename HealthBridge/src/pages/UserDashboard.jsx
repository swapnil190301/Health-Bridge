import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./css/UserDashboard.css";

const UserDashboard = () => {
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

      {/* MOBILE MENU */}
      <button
        className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-content">

          <div className="sidebar-top">
            <div className="logo-circle">
              <img src="/logo.png" alt="logo" className="logo-img" />
            </div>

            <div className="brand-text">
              <h2>Health Bridge</h2>
              <p>User Panel</p> {/* ✅ FIXED */}
            </div>
          </div>

          <nav className="menu">
            <NavLink to="/user-dashboard" className={getMenuClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/appointment" className={getMenuClass} onClick={closeMenu}>
              Book Appointment
            </NavLink>

            <NavLink to="/appointments" className={getMenuClass} onClick={closeMenu}>
              My Appointments
            </NavLink>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="main-section">
        <div className="topbar">
          <p className="welcome-tag">Welcome back 👋</p>

          {/* ❌ OLD: Doctor Dashboard */}
          {/* ✅ NEW */}
          <h1 className="title">User Dashboard</h1>

          <p className="subtitle">
            Book appointments, track your visits, and manage your health in one place.
          </p>
        </div>

        {/* HERO */}
        <section className="hero-card">
          <div className="hero-text">
            <span className="hero-badge">Smart Healthcare Experience</span>

            <h2>Book your appointments quickly and effortlessly.</h2>

            <p>
              Choose your doctor, select a time slot, and manage your bookings
              with a clean and modern experience.
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
                onClick={() => navigate("/appointments")}
              >
                View My Appointments
              </button>
            </div>
          </div>

          <div className="hero-image-card">
            <div className="hero-image-glow"></div>
            <img
              src="/doctor.jpg"
              alt="doctor"
              className="doctor-image"
            />
          </div>
        </section>

        {/* STATS */}
        <section className="stats-grid">
          <div className="info-card">
            <h3>Book Appointment</h3>
            <p>Schedule a new appointment with your preferred doctor.</p>
          </div>

          <div className="info-card">
            <h3>My Bookings</h3>
            <p>View and manage all your upcoming appointments.</p>
          </div>

          <div className="info-card">
            <h3>Health Records</h3>
            <p>Keep track of your consultations and history.</p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default UserDashboard;