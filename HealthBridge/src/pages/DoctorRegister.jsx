import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./css/Auth.css";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    specialization: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setMessage("");
  setLoading(true);

  try {
    // ✅ 1. Signup
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("Signup failed");

    // ✅ 2. Insert into doctors table
    const { error: insertError } = await supabase
      .from("doctors")
      .insert([
        {
          id: user.id,
          full_name: formData.full_name,
          specialization: formData.specialization,
          phone: formData.phone,
          email: formData.email,
        },
      ]);

    if (insertError) throw insertError;

    setMessage("Doctor registered successfully!");
    
  } catch (error) {
    console.error("Registration Error:", error);
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="auth-badge">Health Bridge Clinic</span>

        <h2 className="auth-title">Create Doctor Account</h2>

        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Registering..." : "Doctor Register"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/doctor-signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorRegister;