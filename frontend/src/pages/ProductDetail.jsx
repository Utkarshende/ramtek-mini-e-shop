import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api.js';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

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

  const handleDelete = async (id) => {
  try {
    await API.delete(`/reviews/${id}`);
    setReviews(reviews.filter(r => r._id !== id));
  } catch (err) {
    console.error(err);
  }
};

const handleEdit = (review) => {
  setEditReview(review);
  setComment(review.comment);
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
        <div className="text-blue-500 animate-pulse font-bold tracking-widest text-xl">
          LOADING...
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-white p-10 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 h-fit">

        {/* Left Image Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 group aspect-square">
            <img
              src={mainImg}
              alt={product.title}
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full object-cover cursor-zoom-in"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${mainImg === img ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
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

            <h1 className="text-4xl font-bold text-white mt-4 mb-2">
              {product.title}
            </h1>

            <p className="text-3xl text-white font-light">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <div className="border-t border-slate-800 mt-6 pt-6 space-y-4">
              <h4 className="text-slate-500 text-xs uppercase">Description</h4>
              <p className="text-slate-300">{product.description}</p>
              <p className="text-slate-400 text-sm">
                📍 Location: <span className="text-slate-200">{product.location}</span>
              </p>
            </div>
          </div>

          {/* Seller Box */}
          <div className="mt-8 p-5 bg-slate-950/50 border border-slate-800 rounded-2xl">
// Inside ProductDetail.jsx
{user && user._id === product.seller._id && (
  <button 
    onClick={() => setShowEditModal(true)}
    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full font-bold transition-all"
  >
    Edit Product
  </button>
)}

{/* Simple link to Seller Profile */}
<p className="mt-4">
  Seller: <Link to={`/seller/${product.seller._id}`} className="text-blue-400 underline">{product.seller.name}</Link>
</p>          

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleContact}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all"
              >
                Chat with Seller
              </button>

              <button
                onClick={handleShare}
                className="px-4 bg-slate-800 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl transition-all"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-white mb-8">
          More from <span className="text-blue-500">{product.category}</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map(item => (
            <Link to={`/product/${item._id}`} key={item._id}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <img src={item.images[0]} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold truncate">
                    {item.title}
                  </h3>
                  <p className="text-blue-500 font-bold mt-1">₹{item.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={mainImg}
            className="max-w-full max-h-full rounded-lg"
            alt="Full view"
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
