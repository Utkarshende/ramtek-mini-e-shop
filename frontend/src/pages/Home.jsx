import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../config/constants.js';
import { APP_NAME } from '../config/theme.js';
n
function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/all?category=${selectedCategory}&search=${searchTerm}`);
        setProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Explore <span className="text-blue-500">{APP_NAME}</span>
          </h1>
          <p className="text-slate-500 font-medium">Find the best deals in your local bazar.</p>
        </div>

        s
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900 p-4 rounded-3xl border border-slate-800 mb-12 shadow-2xl">
          <div className="relative w-full md:flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input 
              type="text"
              placeholder="Search items (e.g. iPhone, Pulsar...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none cursor-pointer focus:border-blue-500 transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Loading State with Render Note */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 text-center space-y-6">
            <div className="text-blue-500 animate-spin text-5xl">⚙️</div>
            
            <div className="max-w-md bg-slate-900 border border-blue-500/30 p-6 rounded-3xl shadow-2xl">
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-blue-500 font-bold block mb-2">🚀 Waking up the server...</span>
                Note: This may take 1-2 minutes to load data on the first visit. 
                Our backend on Render goes to sleep after 15 minutes of inactivity.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group">
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full shadow-lg">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">
                        {product.category}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-white font-bold text-lg truncate group-hover:text-blue-400 transition-colors">
                        {product.title}
                      </h3>
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <span className="text-2xl font-black text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800">
                <p className="text-slate-500 text-xl font-medium">No items found in {selectedCategory}.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  className="mt-4 text-blue-500 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;