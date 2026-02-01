import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api.js';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.data);
      setMainImg(data.data.images[0]); // Set initial main image
    };
    getProduct();
  }, [id]);

  if (!product) return <div className="min-h-screen bg-slate-950 text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 p-8 rounded-3xl border border-slate-800">
        
        {/* Left: Image Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 group">
            <img 
              src={mainImg} 
              alt={product.title} 
              className="w-full h-[450px] object-cover transition-transform duration-500 ease-out group-hover:scale-150 cursor-zoom-in"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.target.getBoundingClientRect();
                const x = ((e.pageX - left) / width) * 100;
                const y = ((e.pageY - top) / height) * 100;
                e.target.style.transformOrigin = `${x}% ${y}%`;
              }}
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${mainImg === img ? 'border-blue-500 scale-95' : 'border-transparent opacity-60'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info Section (Keep your existing Contact logic here) */}
        <div className="flex flex-col">
          <span className="text-blue-500 font-bold tracking-widest uppercase text-xs">{product.category}</span>
          <h1 className="text-4xl font-bold text-white mt-2 mb-4">{product.title}</h1>
          <p className="text-3xl text-white font-light mb-6">₹{product.price}</p>
          
          <div className="border-t border-slate-800 pt-6 mt-6">
            <p className="text-slate-400 text-sm mb-2">Location: <span className="text-slate-200">{product.location}</span></p>
            <h4 className="text-slate-400 text-sm mb-2 uppercase tracking-tighter">Description</h4>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          <button 
            onClick={() => window.open(`https://wa.me/91${product.phoneNumber}`, '_blank')}
            className="mt-auto w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Contact via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;