// components/my-calendar.jsx
"use client";
import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { da } from "date-fns/locale";

function CalenderComponent({ onRentalPeriodChange }) {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

  // Calculate the rental period whenever the selected range changes
  useEffect(() => {
    if (selectedRange.from && selectedRange.to) {
      const timeDiff = Math.abs(selectedRange.to - selectedRange.from);
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include both start and end dates
      onRentalPeriodChange(daysDiff);
    } else {
      onRentalPeriodChange(0);
    }
  }, [selectedRange, onRentalPeriodChange]);

  return (
    <div className="flex justify-center ">
      <DayPicker
        locale={da}
        mode="range"
        classNames={{
          selected: `rounded-none`,
          range_middle: `text-darkgreen font-bold`,
          range_start: `bg-lightgreen text-darkgreen font-bold !rounded-full`,
          range_end: `bg-lightgreen text-darkgreen font-bold !rounded-full`,
          today: `text-black font-semibold underline underline-offset-4 `,
          caption_label: `text-black flex items-center`,
          chevron: `fill-black`,
          weekday: `text-gray-400 font-normal`,
          footer: `text-black font-semibold justify-center pt-5 flex items-center`,
        }}
        selected={selectedRange}
        onSelect={setSelectedRange}
        footer={
          selectedRange.from && selectedRange.to
            ? `Fra d. ${selectedRange.from.toLocaleDateString()} til d. ${selectedRange.to.toLocaleDateString()}`
            : selectedRange.from
            ? `Startdato: ${selectedRange.from.toLocaleDateString()}`
            : "Vælg en startdato"
        }
      />
    </div>
  );
}

export default CalenderComponent;
