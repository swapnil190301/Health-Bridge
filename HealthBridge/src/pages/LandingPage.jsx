import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src="/Logo.jpg" alt="Health Bridge Clinic" className="logo" />

      <div className="button-container">
        <button className="btn" onClick={() => navigate("/signin")}>
          SIGN IN
        </button>
        <button className="btn" onClick={() => navigate("/register")}>
          REGISTER
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
