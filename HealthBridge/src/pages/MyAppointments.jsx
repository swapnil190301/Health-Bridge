import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/signin");
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        doctors ( full_name, specialization )
      `)
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true });

    if (!error) setAppointments(data);
  };

  const handleCancel = async (id) => {
    const confirm = window.confirm("Cancel this appointment?");
    if (!confirm) return;

    await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "cancelled" } : a
      )
    );
  };

  return (
    <div className="appointments-page">

      {/* HERO */}
      <div className="appointments-hero">
        <h1>My Appointments</h1>
        <p>Track and manage your health bookings</p>
      </div>

      {/* CONTENT */}
      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-card">
            <div className="empty-icon">📅</div>
            <h2>No Appointments Yet</h2>
            <p>Start by booking your first appointment</p>
            <button
              className="primary-btn"
              onClick={() => navigate("/appointment")}
            >
              Book Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appt) => (
            <div className="appointment-card" key={appt.id}>
              
              <div className="card-top">
                <div>
                  <h3>{appt.doctors?.full_name}</h3>
                  <p className="specialization">
                    {appt.doctors?.specialization}
                  </p>
                </div>

                <span className={`status ${appt.status}`}>
                  {appt.status}
                </span>
              </div>

              <div className="card-body">
                <p>📅 {appt.appointment_date}</p>
                <p>⏰ {appt.appointment_time}</p>
              </div>

              {appt.status !== "cancelled" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(appt.id)}
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;