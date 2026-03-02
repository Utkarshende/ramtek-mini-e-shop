import React from "react";

function SelectField({
  label,
  value,
  onChange,
  options = [],
  name,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-300">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white focus:outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;