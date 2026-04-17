import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./css/MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/signin");
      return;
    }

    setFetchError(null);

    // Fetch rows without embedding "doctors" — nested selects require a FK in Supabase;
    // if the relationship isn't set up, the whole query fails and the list stays empty.
    const { data: rows, error } = await supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status, doctor_id")
      .eq("patient_id", user.id)
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error("MyAppointments load failed:", error);
      setFetchError(error.message || "Could not load appointments.");
      setAppointments([]);
      return;
    }

    const list = rows || [];
    if (list.length === 0) {
      setAppointments([]);
      return;
    }

    const doctorIds = [...new Set(list.map((r) => r.doctor_id).filter(Boolean))];
    let doctorById = {};

    if (doctorIds.length > 0) {
      const { data: docs, error: docErr } = await supabase
        .from("doctors")
        .select("id, full_name, specialization")
        .in("id", doctorIds);

      if (docErr) {
        console.error("MyAppointments doctors load failed:", docErr);
        setFetchError(docErr.message || "Could not load doctor details.");
      } else {
        (docs || []).forEach((d) => {
          doctorById[d.id] = d;
        });
      }
    }

    setAppointments(
      list.map((a) => ({
        ...a,
        doctors: doctorById[a.doctor_id] ?? null,
      }))
    );
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
      <div className="appointments-hero">
        <h1>My Appointments</h1>
        <p>Track and manage your health bookings</p>
      </div>

      {fetchError && (
        <p className="appointments-fetch-error">{fetchError}</p>
      )}

      {appointments.length === 0 && !fetchError ? (
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
      ) : appointments.length > 0 ? (
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
      ) : null}
    </div>
  );
};

export default MyAppointments;