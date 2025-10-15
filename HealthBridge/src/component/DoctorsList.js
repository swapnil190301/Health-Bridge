import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      let { data, error } = await supabase.from("doctors").select("*");
      if (error) console.error(error);
      else setDoctors(data);
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>
            {doc.full_name} - {doc.specialization}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorsList;