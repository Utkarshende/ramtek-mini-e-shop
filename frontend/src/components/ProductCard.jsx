import React from "react";
import { Link } from "react-router-dom";
import { COLORS } from "../config/theme";
import { MESSAGES } from "../constants/messages";

function ProductCard({ item }) {
  if (!item) return null;

  const {
    _id,
    name,
    price,
    category,
    location,
    image,
  } = item;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

  return (
    <Link to={`/product/${_id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">

        {/* IMAGE */}
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          {image ? (
            <img
              src={image}
              alt={name || "product"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-sm">
              📸 {MESSAGES.noImage}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {name || "Untitled Product"}
          </h3>

          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xl font-bold ${COLORS.textPrimary}`}
            >
              {formattedPrice}
            </span>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase font-medium">
              {category || MESSAGES.unknownCategory}
            </span>
          </div>

          <div className="mt-3 flex items-center text-gray-500 text-sm">
            📍 {location || MESSAGES.unknownLocation}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;