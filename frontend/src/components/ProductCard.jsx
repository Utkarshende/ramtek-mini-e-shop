import React from 'react'
import { THEME_COLOR } from '../constants.js'
import { Link } from 'react-router-dom'

function ProductCard({ item }) {
  return (
    <div>
        <Link to={`/product/${item._id}`}>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span>📸 No Image</span>
        )}
      </div>
      

      {/* Content Container */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-ramtekRed">₹{item.price}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase font-medium">
            {item.category}
          </span>
        </div>

        <div className="mt-3 flex items-center text-gray-500 text-sm">
          <span className="mr-1">📍</span>
          {item.location}
        </div>
      </div>
    </div>
    </Link>
    </div>
  )
}

export default ProductCard