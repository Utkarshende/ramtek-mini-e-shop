import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api.js";
import { CATEGORIES } from "../config/constants.js";
import { COLORS, APP_NAME } from "../config/theme.js";
import { VALIDATION } from "../utils/validation.js";
import InputField from "../components/InputField";
import Label from "../components/Label";

function SellProduct() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: CATEGORIES[0],
    description: "",
    otherDetails: "",
    location: "",
    phoneNumber: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  // ================= WORD COUNT =================
  const getWordCount = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordCount = getWordCount(formData.description);

    if (Number(formData.price) < VALIDATION.minPrice) {
      return toast.error(`Price must be more than ₹${VALIDATION.minPrice}`);
    }

    if (formData.phoneNumber.length !== VALIDATION.maxPhoneDigits) {
      return toast.error("Phone number must be 10 digits");
    }

    if (wordCount < VALIDATION.minDescriptionWords) {
      return toast.error(
        `Description must contain at least ${VALIDATION.minDescriptionWords} words`
      );
    }

    if (wordCount > VALIDATION.maxDescriptionWords) {
      return toast.error(
        `Description must not exceed ${VALIDATION.maxDescriptionWords} words`
      );
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
            {APP_NAME}
          </h2>
          <p className="text-slate-400 text-sm">
            Sell your items locally.
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div>
          <Label text="Product Photos (Max 5)" />

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
        <div>
          <Label text="Title" />
          <InputField
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Item Title"
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <Label text="Price (₹)" />
          <InputField
            type="number"
            name="price"
            min={VALIDATION.minPrice}
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* CATEGORY */}
        <div>
          <Label text="Category" />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <Label text="Location" />
          <InputField
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <Label text="Phone Number" />
          <InputField
            name="phoneNumber"
            maxLength={VALIDATION.maxPhoneDigits}
            value={formData.phoneNumber}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                handleChange(e);
              }
            }}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label text="Description" />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 h-28 resize-none"
            required
          />
          <p className="text-xs text-slate-400 mt-1">
            {getWordCount(formData.description)} words
          </p>
        </div>

        {/* OTHER DETAILS */}
        <div>
          <Label text="Other Details (Optional)" />
          <textarea
            name="otherDetails"
            value={formData.otherDetails}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 h-24 resize-none"
          />
        </div>

        <button
          disabled={isUploading}
          className={`w-full py-4 rounded-xl font-bold ${
            isUploading
              ? "bg-slate-800 text-slate-500"
              : `${COLORS.primary} hover:${COLORS.primaryHover}`
          }`}
        >
          {isUploading ? "Posting..." : "POST MY AD"}
        </button>
      </form>
    </div>
  );
}

export default SellProduct;