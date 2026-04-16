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

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchSlots(selectedDoctor);
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    const { data, error } = await supabase.from("doctors").select("*");
    if (!error) setDoctors(data || []);
  };

  const fetchSlots = async (doctorId) => {
    const { data, error } = await supabase
      .from("doctor_slots")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("is_booked", false)
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true });

    if (!error) setAvailableSlots(data || []);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
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

    try {
      // ✅ STEP 1: Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("LOGGED USER:", user);

      if (!user) {
        setMessage("Please login first.");
        return;
      }

      // ✅ STEP 2: CHECK if user exists in PATIENTS table (🔥 MAIN FIX)
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (patientError) {
        console.error("Patient check error:", patientError);
      }

      if (!patientData) {
        setMessage("You are not registered as a patient.");
        await supabase.auth.signOut();
        return;
      }

      if (!selectedDoctor) {
        setMessage("Please select a doctor.");
        return;
      }

      if (!selectedSlot) {
        setMessage("Please select a slot.");
        return;
      }

      // ✅ STEP 3: Insert appointment
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: user.id, // ✅ FIXED (must match patients table)
          doctor_id: selectedDoctor,
          slot_id: selectedSlot.id,
          patients_name: patientName,
          patient_age: Number(patientAge),
          illness: illness,
          appointment_date: selectedSlot.slot_date,
          appointment_time: selectedSlot.slot_time,
          status: "booked",
        });

      if (appointmentError) throw appointmentError;

      // ✅ STEP 4: Update slot
      const { error: slotUpdateError } = await supabase
        .from("doctor_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot.id);

      if (slotUpdateError) throw slotUpdateError;

      setMessage("Appointment booked successfully.");

      setPatientName("");
      setPatientAge("");
      setIllness("");
      setSelectedSlot(null);

      fetchSlots(selectedDoctor);
    } catch (error) {
      console.error("Booking Error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="appointment-page">
      <div className="appointment-wrapper">
        <div className="appointment-left">
          <div className="appointment-header">
            <span className="badge">Health Bridge Clinic</span>
            <h1>Schedule Your Appointment</h1>
            <p>
              Choose your doctor, fill in the patient details, and reserve a slot
              in a few simple steps.
            </p>
          </div>

          <form className="appointment-form" onSubmit={bookAppointment}>
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.full_name} -{" "}
                    {doctor.specialization || "Doctor"}
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
                required
              />

              <input
                type="number"
                placeholder="Patient Age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                required
              />
            </div>

            <textarea
              placeholder="Describe illness"
              value={illness}
              onChange={(e) => setIllness(e.target.value)}
              required
            />

            <div className="slot-grid">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatDate(slot.slot_date)} -{" "}
                  {formatTime(slot.slot_time)}
                </button>
              ))}
            </div>

            <button type="submit" className="book-btn">
              Book Slot
            </button>

            {message && <p className="error">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;