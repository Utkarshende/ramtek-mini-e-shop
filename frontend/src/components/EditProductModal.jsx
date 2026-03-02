import React, { useState } from "react";
import API from "../api";
import InputField from "./InputField";
import { COLORS } from "../config/theme";

function EditProductModal({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put(`/products/${product._id}`, formData);
      onUpdate(res.data.data);
      onClose();
    } catch (err) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Product</h2>

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
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl ${COLORS.secondary} text-white font-bold`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl ${COLORS.primary} text-white font-bold`}
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