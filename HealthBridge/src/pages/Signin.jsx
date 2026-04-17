import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./css/Signin.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 🔹 Step 1: Login user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        throw new Error("Login failed. Please try again.");
      }

      console.log("Logged in user ID:", user.id);

      // 🔹 Step 2: Check PATIENT
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", user.id)
        .single();

      // 🔹 Step 3: Check DOCTOR
      const { data: doctor, error: doctorError } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.id)
        .single();

      const isNoRow = (err) => err?.code === "PGRST116";
      if (patientError && !isNoRow(patientError)) throw patientError;
      if (doctorError && !isNoRow(doctorError)) throw doctorError;

      console.log("Patient:", patient);
      console.log("Doctor:", doctor);

      // 🔴 If not found anywhere
      if (!patient && !doctor) {
        setErrorMsg("You are not registered. Please register first.");
        await supabase.auth.signOut();
        return;
      }

      // ✅ Redirect based on role
      if (doctor) {
        navigate("/doctor-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);

      if (error.message === "Invalid login credentials") {
        setErrorMsg("Invalid email or password.");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <span className="signin-badge">Health Bridge Clinic</span>

        <div className="signin-logo-wrapper">
          <img
            src="/logo.png"
            alt="Health Bridge Clinic"
            className="signin-logo"
          />
        </div>

        <h2 className="signin-title">Sign In</h2>
        <p className="signin-subtitle">
          Welcome back! Login to manage your appointments.
        </p>

        <form onSubmit={handleLogin} className="signin-form">
          <div className="signin-input-group">
            <label>Email</label>
            <input
              type="email"
              className="signin-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signin-input-group">
            <label>Password</label>
            <input
              type="password"
              className="signin-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <p className="signin-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <p className="signin-footer">
          Are you a doctor? <Link to="/doctor-signin">Doctor Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;