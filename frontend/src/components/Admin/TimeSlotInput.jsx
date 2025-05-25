import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TimeSlotInput({ timeSlots, handleTimeChange, handleDeleteTimeSlot, handleAddTimeSlot }) {
  return (
    <div>
      <label htmlFor="timeSlots" className="block text-sm font-medium text-white pb-2">
        Screening Time Slots
      </label>
      {timeSlots.map((slot, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <DatePicker
            selected={slot.startTime}
            onChange={(time) => handleTimeChange(index, "startTime", time)}
            className="p-2 w-full border border-gray-300 rounded-md shadow-sm text-black"
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <button
            type="button"
            onClick={() => handleDeleteTimeSlot(index)}
            className="bg-red-600 text-white py-1 px-4 rounded-md hover:scale-105 hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddTimeSlot}
        className="bg-green-600 text-white py-1 px-4 rounded-md hover:scale-105 hover:bg-green-800"
      >
        Add Time Slot
      </button>
    </div>
  );
}

export default TimeSlotInput;
