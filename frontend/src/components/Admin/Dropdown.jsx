import React from "react";

function Dropdown({data, selected, onDropdownChange, id, name, label}) {
  const handleChange = (event) => {
    onDropdownChange({
      target: {
        name: name,
        value: event.target.value
      }
    });
  };

  return (
    <div className="pb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={selected}
        onChange={handleChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:outline-none text-black"
      >
        <option value="">Select {label}</option>
        {data.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;