import React, {useState} from "react";

function InputField({
    type="text",
    placeholder,
    value,
    onChange,
    maxLength,
    min,
    name
}) 
{
    const [showpassword, setShowPassword] = useState(false);
    const isPassword = type ==="password";
  return (
    <div className="relative">
      <input type={isPassword ? (showpassword ? "text" : "password") : type}
      placeholder={placeholder}
      value={value}
      name={name}
      min={min}
      maxLength={maxLegth}
      onChange={onChange}
      className="w-full bg-slate-900 border-slate-700 rounded-lg px-4 py-3 text-whote focus:outline-none focus:border-blue-500"
      />
      {isPassword && (
        <button 
        type="button"
        onClick={()=>setShowPassword(!showpassword)}
        className="absolute right-3 top-3 text-xs text-blue-400">
            {showpassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  )
}

export default InputField;
