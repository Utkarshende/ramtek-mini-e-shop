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

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        const currentProduct = data.data;

        setProduct(currentProduct);
        setEditData(currentProduct);
        setMainImg(currentProduct.images?.[0] || "");

        const relatedRes = await API.get(
          `/products/all?category=${encodeURIComponent(currentProduct.category)}`
        );

        const filtered = relatedRes.data.data.filter(
          item => item._id !== id
        );

        setRelated(filtered.slice(0, 4));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // ================= UPDATE =================
  const handleInlineUpdate = async () => {
    try {
      setIsUpdating(true);
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

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted!");
      navigate('/');
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // ================= WHATSAPP =================
  const handleContact = () => {
    const phone =
      product?.seller?.phone ||
      product?.phoneNumber ||
      "";

    if (!phone) {
      alert("Seller phone number not available.");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');

    const message = `Hi, I am interested in your product "${product.title}" listed on Ramtek Bazar.`;

    const whatsappURL = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  // ================= SHARE =================
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
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 text-xl font-bold">
        LOADING...
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
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-900 p-8 rounded-3xl border border-slate-800">

        {/* LEFT IMAGES */}
        <div>
          <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={mainImg}
              alt={product.title}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
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

        {/* RIGHT DETAILS */}
        <div className="flex flex-col justify-between">

          <div>
            <span className="text-blue-500 text-sm uppercase font-bold">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold mt-4">
              {product.title}
            </h1>

            <p className="text-3xl mt-4">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>

            <div className="mt-6">
              <h4 className="text-slate-400 text-xs uppercase mb-2">
                Description
              </h4>
              <p className="text-slate-300 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* SELLER SECTION */}
          <div className="mt-8 border-t border-slate-800 pt-6">

            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">

              <p className="text-slate-400 text-xs uppercase mb-2">
                Seller Information
              </p>

              <Link
                to={`/seller/${sellerId}`}
                className="text-blue-400 font-bold hover:underline"
              >
                {product.seller?.name || "Seller"}
              </Link>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-6 flex-wrap">

                {!isOwner && (
                  <>
                    <button
                      onClick={handleContact}
                      className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl font-semibold"
                    >
                      Chat on WhatsApp
                    </button>

                    <button
                      onClick={handleShare}
                      className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl font-semibold"
                    >
                      Share
                    </button>
                  </>
                )}

                {isOwner && (
                  <>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold"
                      >
                        Edit Listing
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleInlineUpdate}
                          disabled={isUpdating}
                          className="bg-green-600 px-5 py-2 rounded-xl"
                        >
                          Save
                        </button>

                        <button
                          onClick={handleDelete}
                          className="bg-red-600 px-5 py-2 rounded-xl"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-slate-700 px-5 py-2 rounded-xl"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}

              </div>
            </div>
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
