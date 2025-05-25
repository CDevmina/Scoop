import React from 'react';

const RatingInput = ({ label, id, name, value, onChange }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || (/^\d*\.?\d{0,1}$/.test(val) && parseFloat(val) <= 10)) {
      onChange({
        target: {
          name,
          value: val
        }
      });
    }
  };

  return (
    <div className="pb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label} (0-10)
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder="Enter rating (e.g., 8.5)"
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:outline-none text-black"
      />
    </div>
  );
};

export default RatingInput;