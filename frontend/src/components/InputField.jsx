import React, { useState } from "react";

function InputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  maxLength,
  min,
  name,
  required = false,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          name={name}
          min={min}
          maxLength={maxLength}
          required={required}
          onChange={onChange}
          className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;