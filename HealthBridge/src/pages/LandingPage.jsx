import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjhlZmUxNzE4ZGJjODE5MWFmNmJhMzcyYzYzYzc1OWQ6ZmlsZV8wMDAwMDAwMDg2MTQ2MjA2YjQyMGQ1MWQ4MGY5YzFlMCIsInRzIjoiMjAzNzYiLCJwIjoicHlpIiwiY2lkIjoiMSIsInNpZyI6ImJlY2UwOTlhNjk2YjI2MDdmMGIwN2ZmMjJlMzYxNDYzZWYwZWZiOGE4MjYxMDg2NzlmN2NhODMxOTJhNjljZjYiLCJ2IjoiMCIsImdpem1vX2lkIjpudWxsLCJjcCI6bnVsbCwibWEiOm51bGx9" alt="Health Bridge Clinic" className="logo" />

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
