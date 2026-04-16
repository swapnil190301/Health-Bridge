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

    // ✅ Fetch doctor name
    const { data: doctorData } = await supabase
      .from("doctors")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (doctorData) {
      setDoctorName(doctorData.full_name);
    }

    // ✅ Fetch appointments + patient details
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        date,
        time,
        status,
        reason,
        patients (
          full_name,
          email,
          phone
        )
      `)
      .eq("doctor_id", user.id);

    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      setAppointments(data);
    }
  };

  // ✅ Logout OUTSIDE fetch
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-signin");
  };

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, Dr. {doctorName}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="appointments-section">
        <h2>Booked Appointments</h2>

        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patients?.full_name}</td>
                  <td>{appt.patients?.email}</td>
                  <td>{appt.patients?.phone}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.reason}</td>
                  <td>{appt.status}</td>
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