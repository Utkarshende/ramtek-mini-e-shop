import React from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../constants.js'

function Navbar() {
 const user = JSON.parse(localStorage.getItem('user'));

return (
  <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
    <h1 className="text-xl font-bold text-white tracking-tight">RAMTEK <span className="text-blue-500">BAZAR</span></h1>
    
    <div className="flex items-center gap-6">
      {user ? (
        <>
          <span className="text-slate-400 text-sm">Hello, <b className="text-white">{user.name}</b></span>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="bg-slate-800 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-all"
          >
            Logout
          </button>
        </>
      ) : (
        <a href="/login" className="text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500 transition-all">
          Login
          
        </a>
      )}
    </div>
  </nav>
);
}

export default Navbar