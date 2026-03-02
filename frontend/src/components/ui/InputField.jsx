import React, { useState } from "react";

function InputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  maxLength,
  minLength,
  min,
  name,
  required = false,
  disabled = false,
  className = "",
  as = "input",
  rows = 3,
  error = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const baseStyles =
    "w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all duration-200";

  const borderStyles = error
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-800 focus:ring-blue-500";

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
        {as === "textarea" ? (
          <textarea
            id={name}
            rows={rows}
            placeholder={placeholder}
            value={value}
            name={name}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            disabled={disabled}
            onChange={onChange}
            className={`${baseStyles} ${borderStyles} resize-none ${className}`}
          />
        ) : (
          <input
            id={name}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            name={name}
            min={min}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            disabled={disabled}
            onChange={onChange}
            className={`${baseStyles} ${borderStyles} ${className}`}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-blue-400 hover:text-blue-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;