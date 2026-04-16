import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./css/Auth.css";

const DoctorSignin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // ✅ 1. Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        throw new Error("Login failed. Please try again.");
      }

      console.log("Logged in user:", user);

      // 🚨 Check email confirmation (important)
      if (!user.email_confirmed_at) {
        setMessage("Please verify your email before logging in.");
        await supabase.auth.signOut();
        return;
      }

      // ✅ 2. Check if doctor exists in DB
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", user.id);

      if (doctorError) {
        console.error("Doctor check error:", doctorError);
        throw new Error("Database error while verifying doctor.");
      }

      console.log("Doctor Data:", doctorData);

      // ✅ 3. Validate doctor
      if (!doctorData || doctorData.length === 0) {
        setMessage("You are not registered as a doctor.");
        await supabase.auth.signOut();
        return;
      }

      // ✅ 4. SUCCESS → Redirect
      navigate("/doctor-dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      // 🔥 Clean user-friendly messages
      if (error.message === "Invalid login credentials") {
        setMessage("Invalid email or password.");
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="auth-badge">Health Bridge Clinic</span>

        <h2 className="auth-title">Doctor Sign In</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/doctor-register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignin;