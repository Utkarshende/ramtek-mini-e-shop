import React, { useState, useEffect } from 'react'
import API from '../api.js'
import ProductCard from '../components/ProductCard.js'
import SearchBar from '../components/SearchBar.js'

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 1. New Search State

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await API.get('/products/all');
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed fetch", error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  // 2. FILTER LOGIC: Match title or category with the search query
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-[8%] py-10">
      {/* Search Section */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {searchQuery ? `Showing results for "${searchQuery}"` : "Explore Ramtek Market"}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-ramtekRed">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed">
              <p className="text-gray-400 text-lg">No items match your search. Try something else!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home