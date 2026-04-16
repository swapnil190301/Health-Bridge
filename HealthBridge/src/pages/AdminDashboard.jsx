import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./css/AdminDashboard.css";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchDoctorData(selectedDoctorId);
      fetchSlots(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("full_name", { ascending: true });

    if (!error && data) {
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoctorId(data[0].id);
      }
    } else {
      console.error(error);
    }
  };

  const fetchSlots = async (doctorId = null) => {
    let query = supabase
      .from("doctor_slots")
      .select(`
        id,
        doctor_id,
        slot_date,
        slot_time,
        is_booked,
        doctors(full_name)
      `)
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true });

    if (doctorId) {
      query = query.eq("doctor_id", doctorId);
    }

    const { data, error } = await query;

    if (!error) {
      setSlots(data || []);
    } else {
      console.error("Error fetching slots:", error.message);
    }
  };

  const fetchDoctorData = async (doctorId) => {
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", doctorId)
      .single();

    if (!doctorError && doctorData) {
      setSelectedDoctor(doctorData);
      setFullName(doctorData.full_name || "");
      setSpecialization(
        doctorData.specialization || doctorData.specialty || ""
      );
      setBio(doctorData.bio || "");
      setImageUrl(doctorData.image_url || "");
    }

    const { data: appointmentData, error: appointmentError } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (!appointmentError) {
      setAppointments(appointmentData || []);
    } else {
      console.error("Error fetching appointments:", appointmentError.message);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedDoctorId) {
      setMessage("Please select a doctor.");
      return;
    }

    const { error } = await supabase
      .from("doctors")
      .update({
        full_name: fullName,
        specialization,
        bio,
        image_url: imageUrl,
      })
      .eq("id", selectedDoctorId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Doctor profile updated successfully.");
    fetchDoctorData(selectedDoctorId);
  };

  const addSlot = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedDoctorId) {
      setMessage("Please select a doctor.");
      return;
    }

    const { error } = await supabase.from("doctor_slots").insert({
      doctor_id: selectedDoctorId,
      slot_date: slotDate,
      slot_time: slotTime,
      is_booked: false,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Slot added successfully.");
    setSlotDate("");
    setSlotTime("");
    fetchSlots(selectedDoctorId);
  };

  const deleteSlot = async (slotId) => {
    const { error } = await supabase
      .from("doctor_slots")
      .delete()
      .eq("id", slotId);

    if (!error) {
      fetchSlots(selectedDoctorId);
    } else {
      console.error("Error deleting slot:", error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-wrapper">
        <header className="dashboard-hero">
          <div className="hero-text">
            <span className="hero-badge">Health Bridge</span>
            <h1>Admin Dashboard</h1>
            <p>Manage doctors, schedules, and appointments.</p>
          </div>
          <div className="hero-actions">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <section className="premium-card">
          <div className="section-title">
            <h3>Select Doctor</h3>
          </div>
          <select
            className="doctor-select"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name}
              </option>
            ))}
          </select>
        </section>

        {selectedDoctor && (
          <section className="premium-card profile-card">
            <div className="profile-card-top">
              <img
                className="profile-avatar"
                src={selectedDoctor.image_url || "/doctor.jpg"}
                alt="Doctor"
              />
              <div className="profile-heading">
                <h2>{selectedDoctor.full_name}</h2>
                <p>
                  {selectedDoctor.specialization ||
                    selectedDoctor.specialty ||
                    "Specialist"}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="premium-card form-card">
          <div className="section-title">
            <h3>Update Doctor Details</h3>
          </div>
          <form className="profile-form" onSubmit={updateProfile}>
            <input
              type="text"
              placeholder="Doctor full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <textarea
              placeholder="Write doctor bio / description"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="5"
              required
            />
            <button type="submit" className="primary-btn">
              Save Profile
            </button>
          </form>
          {message && <p className="status-message">{message}</p>}
        </section>

        <section className="premium-card">
          <div className="section-title">
            <h3>Add Schedule Slot</h3>
            <p>Add available time slots for patient booking.</p>
          </div>
          <form className="slot-form" onSubmit={addSlot}>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn">
              Add Slot
            </button>
          </form>
        </section>

        <section className="premium-card">
          <div className="section-title">
            <h3>Available Slots</h3>
          </div>
          <div className="slot-list">
            {slots.length === 0 ? (
              <p className="empty-text">No slots added yet.</p>
            ) : (
              slots.map((slot) => (
                <div key={slot.id} className="slot-item">
                  <div className="slot-left">
                    <div className="slot-date">{slot.slot_date}</div>
                    <div className="slot-time">{formatTime(slot.slot_time)}</div>
                    <div className="slot-doctor">
                      Dr. {slot.doctors?.full_name || "Unknown"}
                    </div>
                  </div>

                  <div className="slot-right">
                    <span
                      className={`slot-status ${
                        slot.is_booked ? "booked" : ""
                      }`}
                    >
                      {slot.is_booked ? "Booked" : "Available"}
                    </span>

                    {!slot.is_booked && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteSlot(slot.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-card appointments-card">
          <div className="section-title">
            <h3>Booked Appointments</h3>
          </div>
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p className="empty-text">No appointments booked yet.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="appointment-item">
                  <div className="appointment-grid">
                    <div className="appointment-cell">
                      <span className="appointment-label">Patient</span>
                      <span className="appointment-value">
                        {appt.patient_name || appt.patients_name || "Not added"}
                      </span>
                    </div>

                    <div className="appointment-cell">
                      <span className="appointment-label">Date</span>
                      <span className="appointment-value">
                        {appt.appointment_date}
                      </span>
                    </div>

                    <div className="appointment-cell">
                      <span className="appointment-label">Time</span>
                      <span className="appointment-value">
                        {formatTime(appt.appointment_time)}
                      </span>
                    </div>

                    <div className="appointment-cell">
                      <span className="appointment-label">Status</span>
                      <span className="appointment-value">
                        {appt.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;