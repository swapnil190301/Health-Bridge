import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./css/AppointmentForm.css"; // ✅ Add this line

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    illness: "",
    selected_date: "",
    selected_time: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, illness, selected_date, selected_time } = formData;

    if (!selected_date || !selected_time) {
      setMessage("⚠️ Please select a date and time.");
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        patients_name: name,
        age: age,
        description_about_illness: illness,
        appointment_date: selected_date,
        appointment_time: selected_time,
        status: "booked",
      },
    ]);

    if (error) setMessage(`❌ Error: ${error.message}`);
    else setMessage("✅ Appointment booked successfully!");
  };

  return (
    <div className="appointment-container">
      <h2 className="title">Schedule Your Appointment</h2>

      <form onSubmit={handleSubmit}>
        <label>Patients Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter patient's full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Patients Age</label>
        <input
          type="number"
          name="age"
          placeholder="Enter patient's age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>Description About Illness Facing</label>
        <textarea
          name="illness"
          rows="3"
          placeholder="Describe the illness"
          value={formData.illness}
          onChange={handleChange}
          required
        />

        <h4>Date's Available</h4>
<div className="button-group">
  {[
    { label: "12' Aug", value: "2025-08-12" },
    { label: "13' Aug", value: "2025-08-13" },
    { label: "14' Aug", value: "2025-08-14" },
    { label: "19' Aug", value: "2025-08-19" },
  ].map((date, i) => (
    <button
      type="button"
      key={i}
      className={`option-btn ${
        formData.selected_date === date.value ? "selected" : ""
      }`}
      onClick={() =>
        setFormData({ ...formData, selected_date: date.value })
      }
    >
      {date.label}
    </button>
  ))}
</div>


        <h4>Timing's Available</h4>
        <div className="button-group">
          {["11:00 am", "11:30 am", "12 pm", "1 pm"].map((time, i) => (
            <button
              type="button"
              key={i}
              className={`option-btn ${
                formData.selected_time === time ? "selected" : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, selected_time: time })
              }
            >
              {time}
            </button>
          ))}
        </div>

        <button type="submit" className="book-btn">
          Book Slot
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AppointmentForm;
