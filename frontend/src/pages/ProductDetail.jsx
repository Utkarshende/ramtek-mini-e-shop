import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api.js';
import EditProductModal from '../components/EditProductModal'; // Ensure this exists

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // For image zoom
  const [showEditModal, setShowEditModal] = useState(false); // For editing details
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        const currentProduct = data.data;

        setProduct(currentProduct);
        setMainImg(currentProduct.images[0]);

        const relatedRes = await API.get(`/products/all?category=${currentProduct.category}`);
        const filtered = relatedRes.data.data.filter(item => item._id !== id);
        setRelated(filtered.slice(0, 4));

      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleContact = () => {
    const message = `Hi, I saw your listing for "${product.title}" on Ramtek Bazar. Is it still available?`;
    const phone = product.phoneNumber || product.seller?.phone || "91XXXXXXXXXX";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this ${product.title} on Ramtek Bazar!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-bold tracking-widest text-xl">LOADING...</div>
      </div>
    );
  }

  if (!product) return <div className="text-white p-10 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 h-fit">

        {/* Left Image Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 group aspect-square bg-slate-950">
            <img
              src={mainImg}
              alt={product.title}
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full object-contain cursor-zoom-in"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${mainImg === img ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-blue-500 font-bold uppercase text-xs px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-white mt-4 mb-2">{product.title}</h1>
            <p className="text-3xl text-white font-light">₹{product.price.toLocaleString('en-IN')}</p>

            <div className="border-t border-slate-800 mt-6 pt-6 space-y-4">
              <h4 className="text-slate-500 text-xs uppercase">Description</h4>
              <p className="text-slate-300 whitespace-pre-wrap">{product.description}</p>
              <p className="text-slate-400 text-sm">
                📍 Location: <span className="text-slate-200">{product.location || "Ramtek"}</span>
              </p>
            </div>
          </div>

          {/* Seller Box */}
          <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-slate-500 text-xs uppercase mb-1">Seller Information</p>
                <Link to={`/seller/${product.seller?._id}`} className="text-blue-400 text-lg font-bold hover:underline">
                  {product.seller?.name || "Verified Seller"}
                </Link>
              </div>
              
              {/* Only show Edit button if current user is the seller */}
              {user && product.seller && user._id === product.seller._id && (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black border border-yellow-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Edit Listing
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleContact}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-900/20"
              >
                Chat via WhatsApp
              </button>
              <button
                onClick={handleShare}
                className="px-6 bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl transition-all"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Component */}
      {showEditModal && (
        <EditProductModal 
          product={product} 
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedData) => setProduct(updatedData)}
        />
      )}

      {/* Image Zoom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <img src={mainImg} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Full view" />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;