import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import StarRating from '../components/StarRating';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
        setMainImg(data.data.images[0]);
      } catch (err) {
        console.error("Error fetching product details", err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleContact = () => {
    const message = `Hi, I saw your listing for "${product.title}" on Ramtek Bazar. Is it still available?`;
    const whatsappUrl = `https://wa.me/91${product.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const submitRating = async () => {
    if (userRating === 0) return alert("Please select a star rating first.");
    try {
      await API.post(`/users/${product.seller?._id}/rate`, { rating: userRating });
      alert("Thanks for rating the seller!");
    } catch (err) {
      alert("Failed to submit rating.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-bold tracking-widest text-xl">LOADING...</div>
      </div>
    );
  }

  if (!product) return <div className="text-white p-10">Product not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 h-fit">
        
        {/* Left: Image & Gallery Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 group aspect-square md:aspect-auto">
            <div className="absolute bottom-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-[10px] text-white opacity-100 group-hover:opacity-0 transition-opacity">
              Click to expand / Hover to zoom
            </div>
            <img 
              src={mainImg} 
              alt={product.title} 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-[300px] md:h-[500px] object-cover transition-transform duration-500 ease-out group-hover:scale-150 cursor-zoom-in"
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
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-white mt-4 mb-2">{product.title}</h1>
            <p className="text-3xl text-white font-light">₹{product.price.toLocaleString('en-IN')}</p>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div>
              <h4 className="text-slate-500 text-xs uppercase tracking-widest mb-2">Description</h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{product.description}</p>
            </div>
            <p className="text-slate-400 text-sm">📍 Location: <span className="text-slate-200">{product.location}</span></p>
          </div>

          {/* Seller Reputation Box */}
          <div className="mt-8 p-5 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3">Seller: <span className="text-slate-200">{product.seller?.name || "Unknown"}</span></p>
            <div className="flex items-center gap-3">
              <StarRating rating={product.seller?.rating || 0} />
              <span className="text-white text-sm font-bold">{(product.seller?.rating || 0).toFixed(1)}</span>
              <span className="text-slate-600 text-xs">({product.seller?.numReviews || 0} reviews)</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 text-[10px]">Your experience?</p>
                <StarRating rating={userRating} setRating={setUserRating} interactive />
              </div>
              <button onClick={submitRating} className="bg-slate-900 text-blue-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">
                Submit Rating
              </button>
            </div>
          </div>

          <button 
            onClick={handleContact}
            className="mt-8 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-[0.98]"
          >
            <span className="text-lg">Chat with Seller</span>
          </button>
        </div>
      </div>

      {/* Full Screen Lightbox Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white text-4xl hover:text-blue-500 transition-colors">&times;</button>
          <img 
            src={mainImg} 
            className="max-w-full max-h-full rounded-lg shadow-2xl" 
            alt="Full view"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;