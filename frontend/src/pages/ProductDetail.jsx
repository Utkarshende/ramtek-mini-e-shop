import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api.js'

function ProductDetail() {
  const { id } = useParams(); // Gets the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {a
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error("Error fetching product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading details...</div>;
  if (!product) return <div className="text-center mt-20">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white px-[8%] py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Side: Image */}
        <div className="rounded-3xl overflow-hidden bg-gray-100 h-[500px]">
          <img 
            src={product.images[0] || 'https://via.placeholder.com/500'} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col justify-center">
          <span className="text-ramtekRed font-bold uppercase tracking-widest text-sm">
            {product.category}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.title}</h1>
          <p className="text-3xl font-bold text-gray-800 mt-4">₹{product.price}</p>
          
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-gray-500">
            <span>📍</span>
            <span className="font-medium">{product.location}</span>
          </div>

          {/* Call to Action Button */}
          <button className="mt-10 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail