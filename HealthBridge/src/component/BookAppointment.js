import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function BookAppointment() {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const bookAppointment = async () => {
    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: date,
        appointment_time: time,
      },
    ]);

    if (error) console.error(error);
    else alert("✅ Appointment booked!");
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={bookAppointment}>Book</button>
    </div>
  );
}

export default BookAppointment;