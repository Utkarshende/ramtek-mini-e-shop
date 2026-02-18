import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api.js';
import { CATEGORIES } from '../config/constants.js';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        const currentProduct = data.data;

        setProduct(currentProduct);
        setEditData(currentProduct);
        setMainImg(currentProduct.images?.[0] || "");

        // Fetch related products safely
        const relatedRes = await API.get(
          `/products/all?category=${encodeURIComponent(currentProduct.category)}`
        );

        const filtered = relatedRes.data.data.filter(
          item => item._id !== id
        );

        setRelated(filtered.slice(0, 4));

      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleInlineUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await API.put(`/products/${id}`, editData);
      setProduct(res.data.data);
      setIsEditing(false);
      alert("Product updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this listing?")) {
      try {
        await API.delete(`/products/${id}`);
        alert("Product deleted!");
        navigate('/');
      } catch (err) {
        alert("Delete failed.");
      }
    }
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
    loggedInId && sellerId && String(loggedInId) === String(sellerId);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-900 p-8 rounded-3xl border border-slate-800">

        {/* LEFT SIDE IMAGES */}
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

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images?.map((img) => (
              <img
                key={img}
                src={img}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  mainImg === img
                    ? "border-blue-500"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex flex-col justify-between">

          <div>
            {/* CATEGORY */}
            {isEditing ? (
              <select
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className="bg-slate-950 border border-blue-500 text-white px-4 py-2 rounded-xl"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-blue-500 text-sm font-bold uppercase">
                {product.category}
              </span>
            )}

            {/* TITLE */}
            {isEditing ? (
              <input
                className="w-full bg-slate-950 border border-blue-500 rounded-xl px-4 py-2 mt-4 text-white text-3xl font-bold"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            ) : (
              <h1 className="text-4xl font-bold text-white mt-4">
                {product.title}
              </h1>
            )}

            {/* PRICE */}
            <div className="mt-4">
              {isEditing ? (
                <input
                  type="number"
                  className="bg-slate-950 border border-blue-500 rounded-xl px-4 py-2 text-white text-2xl"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      price: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="text-3xl text-white">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <h4 className="text-slate-400 text-xs uppercase mb-2">
                Description
              </h4>

              {isEditing ? (
                <textarea
                  className="w-full bg-slate-950 border border-blue-500 rounded-xl px-4 py-3 text-white"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* SELLER + ACTIONS */}
          <div className="mt-8 border-t border-slate-800 pt-6">

            <Link
              to={`/seller/${sellerId}`}
              className="text-blue-400 font-bold hover:underline"
            >
              {product.seller?.name || "Seller Profile"}
            </Link>

            {isOwner && (
              <div className="flex gap-3 mt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleInlineUpdate}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-700 text-white px-4 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-xl"
                  >
                    Edit Listing
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* IMAGE MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={mainImg}
            className="max-w-full max-h-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
