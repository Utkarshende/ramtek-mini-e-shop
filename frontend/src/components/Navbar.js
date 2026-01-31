import React from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../constants.js'

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-[8%] py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold text-ramtekRed tracking-tight">
        {APP_NAME}
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-gray-700 font-medium hover:text-ramtekRed transition-colors">
          Browse
        </Link>
        
        <Link 
          to="/sell" 
          className="bg-ramtekRed text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-red-200 hover:scale-105 transition-transform"
        >
          + Sell Item
        </Link>
      </div>
    </nav>
  )
}

export default Navbar