import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/AdminRegister.css"; // Reuse the same CSS for consistent styling

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Sign in using Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const user = data.user;

    // Verify that the logged-in user exists in the admins table
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single();

    if (adminError || !adminData) {
      setErrorMsg("Access denied. This account is not registered as an admin.");
      await supabase.auth.signOut();
      return;
    }

    // Redirect to admin dashboard
    navigate("/admin-dashboard");
  };

  return (
    <div className="admin-register-page">
      <div className="admin-register-card">
        <span className="admin-register-badge">Health Bridge Clinic</span>

        <h2 className="admin-register-title">Admin Login</h2>

        <form onSubmit={handleAdminLogin} className="admin-register-form">
          <input
            type="email"
            className="admin-register-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="admin-register-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="admin-register-btn">
            Admin Login
          </button>
        </form>

        {errorMsg && (
          <p className="admin-register-error">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;