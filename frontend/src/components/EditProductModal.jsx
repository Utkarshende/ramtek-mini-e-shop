import React, { useState } from "react";
import API from "../api";
import InputField from "./ui/InputField";
import { COLORS } from "../config/theme";
import { VALIDATION } from "../utils/validation";

function EditProductModal({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    category: product?.category || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const wordCount = formData.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (!formData.name.trim()) {
      return "Product name is required";
    }

    if (formData.price < VALIDATION.minPrice) {
      return `Price must be at least ₹${VALIDATION.minPrice}`;
    }

    if (wordCount < VALIDATION.minDescriptionWords) {
      return `Description must have at least ${VALIDATION.minDescriptionWords} words`;
    }

    if (wordCount > VALIDATION.maxDescriptionWords) {
      return `Description cannot exceed ${VALIDATION.maxDescriptionWords} words`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await API.put(`/products/${product._id}`, formData);
      onUpdate(res.data.data);
      onClose();
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Price (₹)"
            type="number"
            name="price"
            min={VALIDATION.minPrice}
            value={formData.price}
            onChange={handleChange}
            required
          />

          <InputField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500"
              rows={4}
            />

            <p className="text-xs text-slate-400 mt-1">
              {formData.description.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl ${COLORS.primary} hover:${COLORS.primaryHover} text-white font-bold transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;