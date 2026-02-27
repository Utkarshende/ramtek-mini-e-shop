import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api.js";
import { CATEGORIES } from "../config/constants.js";

function SellProduct() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "All",
    description: "",
    otherDetails: "",
    location: "",
    phoneNumber: "",
  });

  // ================= IMAGE HANDLER =================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    setFiles([...files, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Price validation
    if (formData.price < 1) {
      return toast.error("Price must be more than ₹1");
    }

    // ✅ Phone validation
    if (formData.phoneNumber.length !== 10) {
      return toast.error("Phone number must be 10 digits");
    }

    // ✅ Description word limit
    if (formData.description.trim().split(" ").length < 10) {
      return toast.error("Description must contain at least 10 words");
    }

    if (files.length === 0) {
      return toast.error("Please upload at least one image");
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) =>
        data.append(key, formData[key])
      );

      files.forEach((file) => data.append("images", file));

      const response = await API.post("/products/create", data);

      toast.success("Product listed successfully!");

      navigate(`/product/${response.data.data._id}`);
    } catch (err) {
      console.error("Upload Error:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
          "Upload failed. Please check all fields."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center text-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl"
      >
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold">
            RAMTEK <span className="text-blue-500">BAZAR</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Sell your items locally.
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div>
          <label className="text-sm text-slate-400">
            Product Photos (Max 5)
          </label>

          <div className="flex flex-wrap gap-4 mt-3">
            <label className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer">
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

        {/* TITLE */}
        <input
          type="text"
          placeholder="Item Title"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
          required
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        {/* PRICE */}
        <input
          type="number"
          min="1"
          placeholder="Price (₹)"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
          required
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        {/* CATEGORY */}
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* LOCATION */}
        <input
          type="text"
          placeholder="Location"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
          required
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          type="text"
          maxLength={10}
          placeholder="Phone Number"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl"
          required
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              });
            }
          }}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description (min 10 words)"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl h-28 resize-none"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        {/* OTHER DETAILS */}
        <textarea
          placeholder="Other Details (Optional)"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl h-24 resize-none"
          onChange={(e) =>
            setFormData({
              ...formData,
              otherDetails: e.target.value,
            })
          }
        />

        <button
          disabled={isUploading}
          className={`w-full py-4 rounded-xl font-bold ${
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