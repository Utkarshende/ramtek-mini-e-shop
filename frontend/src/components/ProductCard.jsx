import React from "react";
import { Link } from "react-router-dom";
import { COLORS } from "../config/theme";

function ProductCard({ item }) {
  return (
    <Link to={`/product/${item._id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        
        {/* Image */}
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>📸 No Image</span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {item.name}
          </h3>

          <div className="flex justify-between items-center mt-2">
            <span className={`text-xl font-bold ${COLORS.primary.replace("bg", "text")}`}>
              ₹{item.price}
            </span>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase font-medium">
              {item.category}
            </span>
          </div>

          <div className="mt-3 flex items-center text-gray-500 text-sm">
            📍 {item.location}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;