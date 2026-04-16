import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/AdminRegister.css";

const AdminRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleAdminRegister = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  if (password !== confirmPassword) {
    setErrorMsg("Passwords do not match");
    return;
  }

  try {
    // 1️⃣ Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;

    if (!user) {
      throw new Error("User not created");
    }

    console.log("Auth user created:", user.id);

    // 2️⃣ INSERT INTO admins table ✅ (THIS WAS MISSING)
    const { error: insertError } = await supabase.from("admins").insert({
      id: user.id,
      full_name: fullName,
      email: email,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Admin profile not saved");
    }

    setSuccessMsg("Admin registered successfully ✅");

    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => navigate("/admin-login"), 1500);

  } catch (error) {
    console.error("Registration Error:", error);
    setErrorMsg(error.message);
  }
};
  return (
    <div className="admin-register-page">
      <div className="admin-register-card">
        <span className="admin-register-badge">Health Bridge Clinic</span>
        <h2 className="admin-register-title">Create Admin Account</h2>

        <form onSubmit={handleAdminRegister} className="admin-register-form">
          <input
            type="text"
            className="admin-register-input"
            placeholder="Admin full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

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

          <input
            type="password"
            className="admin-register-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="admin-register-btn">
            Admin Register
          </button>
        </form>

        {errorMsg && <p className="admin-register-error">{errorMsg}</p>}
        {successMsg && (
          <p className="admin-register-success">{successMsg}</p>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;