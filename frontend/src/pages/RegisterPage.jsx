import React, { useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { toast } from "react-toastify";
import { COLORS } from "../config/theme";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", formData);
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@ramtek.com"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            minLength={6}
          />

          <button
            type="submit"
            className={`w-full ${COLORS.primary} hover:${COLORS.primaryHover} text-white font-bold py-3 rounded-xl transition-all`}
          >
            Register Now
          </button>
        </form>

        <p className="text-slate-500 text-center mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;