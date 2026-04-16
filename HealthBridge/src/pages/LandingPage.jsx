import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="container">
        <span className="landing-badge">Health Bridge Clinic</span>

        <div className="logo-wrapper">
          <img src="/logo.png" alt="Health Bridge" className="logo" />
        </div>

        <h1 className="landing-title">Welcome to Health Bridge</h1>
        <p className="landing-subtitle">
          Book appointments, manage doctor access, and handle clinic workflows
          through one clean and modern healthcare dashboard.
        </p>

        <div className="button-container">
          <button className="btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>

          <button className="btn" onClick={() => navigate("/register")}>
            Register
          </button>

          <button className="btn" onClick={() => navigate("/admin-login")}>
            Admin Login
          </button>

          <button className="btn" onClick={() => navigate("/admin-register")}>
            Admin Register
          </button>

          <button className="btn" onClick={() => navigate("/doctor-signin")}>
            Doctor Sign In
          </button>

          <button className="btn" onClick={() => navigate("/doctor-register")}>
            Doctor Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;