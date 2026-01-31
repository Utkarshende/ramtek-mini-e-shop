import React, { useState, useEffect } from 'react'
import API from '../api.js'
import ProductCard from '../components/ProductCard.js'

function Home() {
  // 1. STATE: To store our Ramtek market data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH: Get data from Backend when page loads
  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await API.get('/products/all');
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  // 3. RENDER: The UI
  return (
    <div className="min-h-screen bg-gray-50 px-[8%] py-10">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Featured Listings in <span className="text-ramtekRed">Ramtek</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Discover second-hand gems from your local community.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ramtekRed"></div>
        </div>
      ) : (
        /* The Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No items listed yet. Be the first to sell!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home