import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/doctor-signin");
      return;
    }

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id, full_name")
      .eq("id", user.id)
      .single();

    if (doctorError || !doctor) return;

    setDoctorName(doctor.full_name);

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        reason,
        patients (
          full_name,
          email,
          phone
        )
      `)
      .eq("doctor_id", doctor.id);

    if (!error) setAppointments(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-signin");
  };

  return (
    <div className="doctor-dashboard">

      {/* HEADER */}
      <div className="dashboard-header glass">
        <div>
          <p className="welcome-text">Welcome back 👋</p>
          <h1>Dr. {doctorName}</h1>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* APPOINTMENTS */}
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
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <strong>{appt.patients?.full_name || "N/A"}</strong>
                  </td>

                  <td>
                    <div>{appt.patients?.email || "N/A"}</div>
                    <small>{appt.patients?.phone || ""}</small>
                  </td>

                  <td>{appt.appointment_date}</td>
                  <td>{appt.appointment_time}</td>
                  <td>{appt.reason || "-"}</td>

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