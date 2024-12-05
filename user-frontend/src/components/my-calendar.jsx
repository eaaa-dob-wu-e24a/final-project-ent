"use client";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { da } from "date-fns/locale";

function CalenderComponent() {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

  return (
    <div className="flex justify-center ">
      <DayPicker
        locale={da} // Replace with 'da' for Danish localization
        mode="range"
        classNames={{
          selected: `rounded-none`,
          range_middle: `text-darkgreen font-bold`,
          range_start: `bg-lightgreen text-darkgreen font-bold !rounded-full`,
          range_end: `bg-lightgreen text-darkgreen font-bold !rounded-full`,
          today: `text-black font-semibold underline underline-offset-4 `,
          caption_label: `text-black flex items-center`,
          chevron: `fill-black`, // Add your custom color class here
          weekday: `text-gray-400 font-normal`,
          footer: `text-black font-semibold justify-center pt-5 flex items-center`,
        }}
        selected={selectedRange}
        onSelect={setSelectedRange}
        footer={
          selectedRange.from && selectedRange.to
            ? `  fra d. 
             ${selectedRange.from.toLocaleDateString()} til d. ${selectedRange.to.toLocaleDateString()}`
            : selectedRange.from
            ? `Starts dato: ${selectedRange.from.toLocaleDateString()}`
            : "Vælg en starts dato"
        }
      />
    </div>
  );
}

export default CalenderComponent;
