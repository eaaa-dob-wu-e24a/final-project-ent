"use client";
// src/components/Calendar.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";

export default function MyCalendar() {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={true}
      />
      {dateRange[0] && dateRange[1] && (
        <p className="mt-4 text-center">
          Valgte datoer: {dateRange[0].toLocaleDateString()} -{" "}
          {dateRange[1].toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
