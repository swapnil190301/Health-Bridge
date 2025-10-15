import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import "./css/DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <img src="/profile.jpg" alt="Profile" className="profile-img" />
          <h3>Dr. Smith</h3>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>

        <nav className="nav-menu">
  <Link to="/dashboard" className="nav-item">
    <span>Home</span>
  </Link>
  <Link to="/dashboard/about" className="nav-item">
    <span>Doctor</span>
  </Link>
  <Link to="/dashboard/schedule" className="nav-item">
    <span>Schedule</span>
  </Link>
  <Link to="/dashboard/appointment" className="nav-item">
    <span>Appointment</span>
  </Link>
</nav>

      </aside>

      {/* Main Section */}
      <main className="main-content">
        <div className="button-container">
          <button
  className="main-btn"
  onClick={() => navigate("/dashboard/appointment")}
>
  Book Appointment
</button>
<button
  className="main-btn"
  onClick={() => navigate("/dashboard/schedule")}
>
  Appointment Available
</button>

        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
