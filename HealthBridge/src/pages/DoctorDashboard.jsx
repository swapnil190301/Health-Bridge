import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/doctor-signin");
      return;
    }

    const { data: doctor } = await supabase
      .from("doctors")
      .select("id, full_name")
      .eq("id", user.id)
      .single();

    if (!doctor) return;

    setDoctorName(doctor.full_name);

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctor.id);

    if (!error) setAppointments(data || []);
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-signin");
  };

  return (
    <div className="doctor-dashboard">

      <div className="dashboard-header glass">
        <div>
          <p className="welcome-text">Welcome back 👋</p>
          <h1>Dr. {doctorName}</h1>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <section className="appointments-section glass">
        <div className="section-header">
          <h2>Booked Appointments</h2>
          <span>{appointments.length} Total</span>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <p>No appointments booked yet.</p>
          </div>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Date</th>
                <th>Time</th>
                <th>Illness</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patients_name || "N/A"}</td>
                  <td>{appt.patient_age || "-"}</td>
                  <td>{appt.appointment_date}</td>
                  <td>{appt.appointment_time}</td>
                  <td>{appt.illness || "-"}</td>

                  <td>
                    <span className={`status ${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;