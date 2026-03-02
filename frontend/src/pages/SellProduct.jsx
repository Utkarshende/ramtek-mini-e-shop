import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api.js";
import { CATEGORIES } from "../config/constants.js";
import InputField from "../components/ui/InputField.jsx";

function SellProduct() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: CATEGORIES[0] || "Electronics",
    description: "",
    otherDetails: "",
    location: "",
    phoneNumber: "",
  });

  /* ---------------- CLEANUP PREVIEWS ---------------- */

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* ---------------- IMAGE HANDLER ---------------- */

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!formData.title.trim())
      return "Title is required";

    if (!formData.price || Number(formData.price) < 1)
      return "Price must be more than ₹1";

    if (!/^\d{10}$/.test(formData.phoneNumber))
      return "Phone number must be exactly 10 digits";

    const wordCount =
      formData.description.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount < 10)
      return "Description must contain at least 10 words";

    if (!formData.location.trim())
      return "Location is required";

    if (files.length === 0)
      return "Please upload at least one image";

    return null;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return toast.error(error);

    setIsUploading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("price", Number(formData.price));
      data.append("category", formData.category);
      data.append("description", formData.description.trim());
      data.append("otherDetails", formData.otherDetails.trim());
      data.append("location", formData.location.trim());
      data.append("phoneNumber", formData.phoneNumber);

      files.forEach((file) => data.append("images", file));

      const response = await API.post("/products/create", data);

      toast.success("Product listed successfully!");
      navigate(`/product/${response.data.data._id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Upload failed. Please check all fields."
      );
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center text-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl"
      >
        <h2 className="text-3xl font-bold">
          RAMTEK <span className="text-blue-500">BAZAR</span>
        </h2>

        {/* IMAGE SECTION */}
        <div>
          <label className="text-sm text-slate-400">
            Product Photos (Max 5)
          </label>

          <div className="flex flex-wrap gap-4 mt-3">
            <label className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700 transition">
              <span className="text-2xl text-slate-400">+</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {previews.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl border border-slate-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FORM FIELDS */}

        <InputField
          label="Item Title"
          name="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          min="1"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          required
        />

        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          maxLength={10}
          value={formData.phoneNumber}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              });
            }
          }}
          required
        />

        <InputField
          label="Description"
          name="description"
          as="textarea"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          required
        />

        <InputField
          label="Other Details"
          name="otherDetails"
          as="textarea"
          rows={3}
          value={formData.otherDetails}
          onChange={(e) =>
            setFormData({
              ...formData,
              otherDetails: e.target.value,
            })
          }
        />

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={isUploading}
          className={`w-full py-4 rounded-xl font-bold transition ${
            isUploading
              ? "bg-slate-800 text-slate-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {isUploading ? "Posting..." : "POST MY AD"}
        </button>
      </form>
    </div>
  );
}

export default SellProduct;