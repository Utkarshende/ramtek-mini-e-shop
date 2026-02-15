import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Electronics", "Vehicles", "Furniture", "Real Estate", "Books"];

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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10"> {/* Fresh light background */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Explore <span className="text-blue-600">Ramtek</span>
          </h1>
          <p className="text-gray-500 font-medium">Find the best deals in your local bazar.</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-200 mb-12 shadow-sm">
          <div className="relative w-full md:flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text"
              placeholder="Search items (e.g. iPhone, Pulsar...)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Loading State with Render Note */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 text-center space-y-6">
            <div className="text-blue-600 animate-spin text-5xl">⚙️</div>
            
            <div className="max-w-md bg-white border border-blue-100 p-6 rounded-3xl shadow-lg">
              <p className="text-gray-600 text-sm leading-relaxed">
                <span className="text-blue-600 font-bold block mb-2">🚀 Waking up the server...</span>
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
                  <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full shadow-sm">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-blue-600 font-bold uppercase tracking-widest shadow-sm">
                        {product.category}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-gray-800 font-bold text-lg truncate group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                        <span className="text-2xl font-black text-gray-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-medium">No items found in {selectedCategory}.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  className="mt-4 text-blue-600 font-bold hover:underline"
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