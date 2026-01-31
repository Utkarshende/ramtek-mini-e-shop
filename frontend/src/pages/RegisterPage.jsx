import React, { useState } from 'react';
import API from '../api.jsx';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', formData);
      alert(data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-tight">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter your name"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="example@ramtek.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-blue-900/20 transition-all active:scale-95">
            Register Now
          </button>
        </form>
        <p className="text-slate-500 text-center mt-6 text-sm">
          Already have an account? <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;