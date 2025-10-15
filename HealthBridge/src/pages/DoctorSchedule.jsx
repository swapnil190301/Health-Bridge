import React from "react";

const DoctorSchedule = () => {
  const schedule = {
    1: ["10:00 AM", "2:00 PM"],
    4: ["9:30 AM", "1:30 PM"],
    10: ["12:00 PM", "4:00 PM"],
  };

  return (
    <div>
      <header className="header">
        Doctor Availability – Dr. John Doe (September 2025)
      </header>
      <div className="calendar">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const times = schedule[day];
          return (
            <div key={day} className="day">
              <h4>{day}</h4>
              {times
                ? times.map((t) => (
                    <div key={t} className="slot">
                      {t}
                    </div>
                  ))
                : "Not Available"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorSchedule;
