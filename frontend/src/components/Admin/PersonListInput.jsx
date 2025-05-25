import React from "react";

const PersonListInput = ({ label, persons = [], onChange, onAdd, onRemove }) => {
  return (
    <div className="pb-4">
      <label className="block text-sm font-medium text-white">{label}</label>
      {persons.map((person, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            value={person}
            onChange={(e) => onChange(index, e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-200 focus:outline-none text-black"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="bg-red-600 text-white py-1 px-4 rounded-md hover:scale-105 hover:bg-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="bg-green-600 text-white py-1 px-4 rounded-md hover:scale-105 hover:bg-green-800"
      >
        Add {label}
      </button>
    </div>
  );
};

export default PersonListInput;