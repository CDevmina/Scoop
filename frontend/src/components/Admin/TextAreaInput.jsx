import React from 'react';

function TextAreaInput({ label, id, name, value, onChange }) {
  return (
    <div className="pb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:outline-none text-black"
      />
    </div>
  );
}

export default TextAreaInput;
