import React, { useState, useMemo } from "react";
import API from "../api";
import InputField from "./ui/InputField";
import { COLORS } from "../config/theme";
import { VALIDATION } from "../constants/validation";
import { MESSAGES } from "../constants/messages";

function EditProductModal({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    category: product?.category || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  /* ---------------- WORD COUNT ---------------- */
  const wordCount = useMemo(() => {
    return formData.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [formData.description]);

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    if (!formData.name.trim()) {
      return MESSAGES.productNameRequired;
    }

    if (Number(formData.price) < VALIDATION.minPrice) {
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

  /* ---------------- SUBMIT ---------------- */
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
      const { data } = await API.put(
        `/products/${product._id}`,
        formData
      );

      onUpdate(data?.data);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || MESSAGES.productUpdateFailed
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
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

          <InputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
            rows={4}
            required
          />

          <p className="text-xs text-slate-400">
            {wordCount} words
          </p>

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
              className={`flex-1 px-6 py-3 rounded-xl ${COLORS.primary} ${COLORS.primaryHover} text-white font-bold transition-all ${
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