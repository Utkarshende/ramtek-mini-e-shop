import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api.js';
import StarRating from '../components/StarRating';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Fetch main product
        const { data } = await API.get(`/products/${id}`);
        const currentProduct = data.data;
        setProduct(currentProduct);
        setMainImg(currentProduct.images[0]);

        // 2. Fetch related items by category (immediately after we know the category)
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
    // Scroll to top when ID changes (important for "Related Items" clicks)
    window.scrollTo(0, 0);
  }, [id]);

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

  const handleContact = () => {
    const message = `Hi, I saw your listing for "${product.title}" on Ramtek Bazar. Is it still available?`;
    // Fallback logic for phone number location
    const phone = product.phoneNumber || product.seller?.phone || "91XXXXXXXXXX";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const submitRating = async () => {
    if (!product.seller?._id) return alert("Seller information is missing.");
    if (userRating === 0) return alert("Please select a star rating first.");

    try {
      await API.post(`/users/${product.seller._id}/rate`, { rating: userRating });
      alert("Thanks for rating!");
    } catch (err) {
      console.error(err);
      alert("Could not submit rating. Are you logged in?");
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
        
        {/* Left: Image & Gallery Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 group aspect-square">
            <img 
              src={mainImg} 
              alt={product.title} 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-150 cursor-zoom-in"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.pageX - left - window.scrollX) / width) * 100;
                const y = ((e.pageY - top - window.scrollY) / height) * 100;
                e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
              }}
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {product.images?.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all shrink-0 ${mainImg === img ? 'border-blue-500 scale-95' : 'border-transparent opacity-50 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-white mt-4 mb-2">{product.title}</h1>
            <p className="text-3xl text-white font-light">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="border-t border-slate-800 mt-6 pt-6 space-y-4">
              <h4 className="text-slate-500 text-xs uppercase tracking-widest">Description</h4>
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
              <p className="text-slate-400 text-sm">📍 Location: <span className="text-slate-200">{product.location}</span></p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Seller Rep Box */}
            <div className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3">Seller: <span className="text-slate-200">{product.seller?.name || "Unknown"}</span></p>
              <div className="flex items-center gap-3">
                <StarRating rating={product.seller?.rating || 0} />
                <span className="text-white text-sm font-bold">{(product.seller?.rating || 0).toFixed(1)}</span>
                <span className="text-slate-600 text-xs">({product.seller?.numReviews || 0} reviews)</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
                <StarRating rating={userRating} setRating={setUserRating} interactive />
                <button onClick={submitRating} className="bg-slate-900 text-blue-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">
                  Submit Rating
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleContact} className="flex-[3] bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/20">
                Chat with Seller
              </button>
              <button onClick={handleShare} className="flex-1 bg-slate-800 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-2xl transition-all flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5m0 10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Related Items */}
      <div className="max-w-6xl mx-auto mt-20">  
        <h2 className="text-2xl font-bold text-white mb-8 px-2">More from <span className="text-blue-500">{product.category}</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map(item => (
            <Link to={`/product/${item._id}`} key={item._id} className="group">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
                <img src={item.images[0]} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold truncate">{item.title}</h3>
                  <p className="text-blue-500 font-bold mt-1">₹{item.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 text-white text-4xl">&times;</button>
          <img src={mainImg} className="max-w-full max-h-full rounded-lg" alt="Full view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;