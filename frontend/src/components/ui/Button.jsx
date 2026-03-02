import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyle =
    "w-full py-4 rounded-xl font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white",
    danger:
      "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;