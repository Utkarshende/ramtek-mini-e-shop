import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  // Helper for active link styling
  const linkStyle = ({ isActive }) => 
    isActive ? "text-blue-500 font-medium" : "text-slate-400 hover:text-white transition-colors";

  return (
    <nav className="bg-slate-950 border-b border-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-xl font-bold text-white tracking-tighter">
          RAMTEK <span className="text-blue-600">BAZAR</span>
        </NavLink>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm uppercase tracking-widest">
          <NavLink to="/" className={linkStyle}>Home</NavLink>
          <NavLink to="/about" className={linkStyle}>About</NavLink>
          <NavLink to="/sell" className={linkStyle}>Sell</NavLink>
          {user && (
  <NavLink to="/my-listings" className={linkStyle}>My Items</NavLink>
  
)}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs italic">Logged in as <b className="text-slate-200">{user.name}</b></span>
            <button 
              onClick={handleLogout}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded hover:bg-red-950/30 hover:text-red-500 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-all">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;