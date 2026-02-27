import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api.js";
import { CATEGORIES } from "../config/constants.js";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null); // ✅ FIXED
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        const currentProduct = data.data;

        setProduct(currentProduct);
        setEditData(currentProduct);
        setMainImg(currentProduct.images?.[0] || "");

        const relatedRes = await API.get(
          `/products/all?category=${encodeURIComponent(
            currentProduct.category
          )}`
        );

        const filtered = relatedRes.data.data.filter(
          (item) => item._id !== id
        );

        setRelated(filtered.slice(0, 4));
      } catch (err) {
        toast.error("Error loading product.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [id]);

  // 🎨 Dynamic Category Colors
  const getCategoryColor = (category) => {
    switch (category) {
      case "Electronics":
        return "text-blue-500";
      case "Vehicles":
        return "text-red-500";
      case "Furniture":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  const handleInlineUpdate = async () => {
    if (editData.price < 1) {
      toast.error("Price must be greater than ₹1");
      return;
    }

    if (editData.description.split(" ").length < 10) {
      toast.error("Description must contain at least 10 words.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await API.put(`/products/${id}`, editData);
      setProduct(res.data.data);
      setIsEditing(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this listing?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted!");
      navigate("/");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleContact = () => {
    const phoneNumber =
      product?.phoneNumber || product?.seller?.phone;

    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Invalid seller contact number.");
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi, I'm interested in your listing: ${product.title} on Ramtek Bazar.`
    );

    window.open(
      `https://wa.me/91${cleanNumber}?text=${message}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 text-xl font-bold animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Product not found.
      </div>
    );
  }

  const loggedInId = user?.id || user?._id;
  const sellerId = product.seller?._id || product.seller;
  const isOwner =
    loggedInId &&
    sellerId &&
    String(loggedInId) === String(sellerId);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-900 p-8 rounded-3xl border border-slate-800">
        
        {/* IMAGE SECTION */}
        <div>
          <div className="aspect-square bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            {mainImg && (
              <img
                src={mainImg}
                alt={product.title}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div>
          <span
            className={`text-sm font-bold uppercase ${getCategoryColor(
              product.category
            )}`}
          >
            {product.category}
          </span>

          <h1 className="text-4xl font-bold text-white mt-4">
            {product.title}
          </h1>

          <p className="text-3xl text-white mt-4">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>

          <p className="text-slate-300 mt-6 whitespace-pre-wrap">
            {product.description}
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleContact}
              className="text-green-500"
            >
              Chat via WhatsApp
            </button>

            <button
              onClick={handleShare}
              className="text-slate-300"
            >
              Share
            </button>
          </div>

          {isOwner && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-xl"
              >
                Edit Listing
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={mainImg}
            className="max-w-full max-h-full rounded-xl"
            alt="preview"
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;