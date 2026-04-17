import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./css/AppointmentForm.css";

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [illness, setIllness] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false); // ✅ NEW

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) fetchSlots(selectedDoctor);
    else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    const { data } = await supabase.from("doctors").select("*");
    setDoctors(data || []);
  };

  const fetchSlots = async (doctorId) => {
    const { data } = await supabase
      .from("doctor_slots")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("is_booked", false) // ✅ Only free slots
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true });

    setAvailableSlots(data || []);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return setMessage("Please login first.");
      }

      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!patientData) {
        setLoading(false);
        return setMessage("You are not registered as a patient.");
      }

      if (!selectedDoctor) {
        setLoading(false);
        return setMessage("Select doctor");
      }

      if (!selectedSlot) {
        setLoading(false);
        return setMessage("Select slot");
      }

      console.log("Selected Slot:", selectedSlot); // ✅ DEBUG

      // 🔥 Prevent double booking
      const { data: existing } = await supabase
        .from("appointments")
        .select("*")
        .eq("slot_id", selectedSlot.id)
        .eq("status", "booked");

      if (existing.length > 0) {
        setLoading(false);
        return setMessage("❌ Slot already booked");
      }

      // ✅ Insert appointment
      const { error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        slot_id: selectedSlot.id,
        patients_name: patientName,
        patient_age: Number(patientAge),
        illness,
        appointment_date: selectedSlot.slot_date,
        appointment_time: selectedSlot.slot_time,
        status: "booked",
      });

      if (error) throw error;

      // ✅ UPDATED SAFE SLOT UPDATE (YOUR FIX)
      const { error: slotError } = await supabase
        .from("doctor_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot.id)
        .select();

      if (slotError) {
        console.log("Slot update failed:", slotError);
        setLoading(false);
        return setMessage("Slot update failed");
      }

      setMessage("✅ Appointment booked successfully");

      // Reset form
      setPatientName("");
      setPatientAge("");
      setIllness("");
      setSelectedSlot(null);

      fetchSlots(selectedDoctor); // refresh slots
    } catch (err) {
      console.log(err);
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="appointment-page">
      <div className="appointment-wrapper">

        <div className="appointment-left">
          <div className="appointment-header">
            <span className="badge">Health Bridge Clinic</span>
            <h1>Schedule Your Appointment</h1>
          </div>

          <form className="appointment-form" onSubmit={bookAppointment}>

            <div className="form-group">
              <label>Select Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Patient Age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Describe illness"
              value={illness}
              onChange={(e) => setIllness(e.target.value)}
            />

            <div className="slots-section">
              <div className="section-title-row">
                <h2>Available Slots</h2>
                <span className="slot-note">Pick one slot to continue</span>
              </div>

              {availableSlots.length === 0 ? (
                <p className="no-slots">No slots available</p>
              ) : (
                <div className="slot-grid">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`slot-card ${
                        selectedSlot?.id === slot.id ? "selected-slot" : ""
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="slot-date">
                        {formatDate(slot.slot_date)}
                      </div>
                      <div className="slot-time">
                        {formatTime(slot.slot_time)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="book-btn" disabled={loading}>
              {loading ? "Booking..." : "Book Slot"}
            </button>

            {message && (
              <p
                className={`form-message ${
                  message.includes("success") ? "success" : "error"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="appointment-right">
          <div className="info-card highlight-card">
            <h2>Why book with us?</h2>
            <p>
              Fast doctor selection, real-time slot availability, smooth booking,
              and better appointment management in one place.
            </p>
          </div>

          <div className="info-card support-card">
            <h2>Need help?</h2>
            <p>
              Select a doctor, choose your slot, and complete the form.
              Your appointment gets saved instantly after booking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppointmentForm;