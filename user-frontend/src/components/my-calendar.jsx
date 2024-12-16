"use client";
import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { da } from "date-fns/locale";

function CalenderComponent({ onRentalPeriodChange, onDateRangeChange }) {
  // state to manage selected date range
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

  // Calculate the rental period whenever the selected range changes
  useEffect(() => {
    if (selectedRange.from && selectedRange.to) {
      // Calculate the difference in time between the start and end dates
      const timeDiff = Math.abs(selectedRange.to - selectedRange.from);
      // Convert the time difference to days and include both the start and end dates
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      onRentalPeriodChange(daysDiff);
    } else {
      onRentalPeriodChange(0);
    }
  }, [selectedRange, onRentalPeriodChange]);

  useEffect(() => {
    onDateRangeChange(selectedRange.from, selectedRange.to);
  }, [selectedRange, onDateRangeChange]);

  // Handle the selection of a date range
  const handleSelect = (range) => {
    // Check if the new selection is the same as the current selection
    if (
      selectedRange.from?.getTime() === range?.from?.getTime() &&
      selectedRange.to?.getTime() === range?.to?.getTime()
    ) {
      // Do nothing if the same range is selected again
      return;
    }
    // Update the selected range, or reset it if no range is provided
    setSelectedRange(range || { from: null, to: null });
  };

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
        onSelect={handleSelect}
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
