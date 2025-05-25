import React from 'react';

function TextInput({ label, id, name, value, onChange }) {
  return (
    <div className="pb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-200 focus:outline-none text-black"
      />
    </div>
  );
}

export default TextInput;
