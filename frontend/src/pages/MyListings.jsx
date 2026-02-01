import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { Link } from 'react-router-dom';

function MyListings() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      // Assuming your backend has an endpoint to get products by user
      const { data } = await API.get('/products/user/my-items');
      setMyProducts(data.data);
    } catch (err) {
      console.error("Error fetching your items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/products/${id}`);
        setMyProducts(myProducts.filter(item => item._id !== id));
        alert("Listing removed successfully.");
      } catch (err) {
        alert("Failed to delete the item.");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white p-10">Loading your shop...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">My <span className="text-blue-500">Listings</span></h1>
        <p className="text-slate-500 mb-8 font-medium">Manage the items you've posted for sale in Ramtek.</p>

        <div className="space-y-4">
          {myProducts.length > 0 ? (
            myProducts.map((item) => (
              <div key={item._id} className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <img src={item.images[0]} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-800" />
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-blue-500 font-bold">₹{item.price}</p>
                </div>

                <div className="flex gap-2">
                  <Link to={`/product/${item._id}`} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition-all">
                    View
                  </Link>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="px-4 py-2 bg-red-950/20 text-red-500 border border-red-900/50 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-900 rounded-3xl">
              <p className="text-slate-500 mb-4">You haven't listed any items yet.</p>
              <Link to="/sell" className="text-blue-500 font-bold hover:underline">Start Selling →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyListings;