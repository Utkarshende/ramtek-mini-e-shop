import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Vehicles", "Furniture", "Real Estate", "Books"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products/all');
        setProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Search and Filter Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-6">Explore <span className="text-blue-500">Ramtek</span></h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <input 
            type="text"
            placeholder="Search items (e.g. iPhone, Pulsar...)"
            className="w-full md:flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none cursor-pointer focus:border-blue-500"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Display */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="group">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
                <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">{product.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-white">₹{product.price}</span>
                    <span className="text-xs text-slate-500 uppercase">{product.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-500">
            No items found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;