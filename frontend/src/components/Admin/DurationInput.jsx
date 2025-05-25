import React from 'react';

const DurationInput = ({ label, id, name, value, onChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onChange({
        target: {
          name,
          value
        }
      });
    }
  };

  return (
    <div className="pb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label} (minutes)
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder="Enter duration in minutes"
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:outline-none text-black"
      />
    </div>
  );
};

export default DurationInput;