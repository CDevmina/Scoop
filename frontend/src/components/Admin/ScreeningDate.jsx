import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScreeningDate = ({ label, selectedDate, onDateChange }) => {
  return (
    <div className="pb-4">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-black"
      />
    </div>
  );
};

export default ScreeningDate;