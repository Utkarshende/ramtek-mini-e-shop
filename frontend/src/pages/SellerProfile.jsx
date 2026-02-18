import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api.js';

function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const { data } = await API.get(`/users/seller/${id}`);
        setSeller(data.seller);
        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching seller profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-blue-500 animate-pulse font-bold">LOADING PROFILE...</div>
    </div>
  );

  if (!seller) return <div className="text-white p-10 text-center">Seller not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Seller Header Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {seller.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{seller.name}</h1>
            <p className="text-slate-400 mt-1">Member since {new Date(seller.createdAt).getFullYear()}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <span className="bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-sm border border-slate-700">
                {products.length} Products Listed
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          All Listings from {seller.name}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="group">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-blue-500">
                  <div className="aspect-square overflow-hidden bg-slate-950">
                    <img 
                      src={product.images[0]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      alt={product.title}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold truncate">{product.title}</h3>
                    <p className="text-blue-500 font-bold mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">This seller currently has no active listings.</p>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;a