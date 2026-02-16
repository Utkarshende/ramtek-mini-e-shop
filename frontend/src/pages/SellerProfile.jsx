import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setSeller(data.seller);
        setProducts(data.products);
      } catch (err) {
        console.error("Seller fetch error:", err);
      }
    };

    fetchSeller();
  }, [id]);

  if (!seller) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Seller...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Seller Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12">
          <h1 className="text-3xl font-bold">{seller.name}</h1>
          <p className="text-slate-400 mt-2">{seller.email}</p>
          <p className="text-slate-500 text-sm mt-4">
            Member since {new Date(seller.createdAt).toDateString()}
          </p>
        </div>

        {/* Seller Products */}
        <h2 className="text-2xl font-bold mb-6">Listings by {seller.name}</h2>

        {products.length === 0 ? (
          <p className="text-slate-500">No products posted yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((item) => (
              <Link to={`/product/${item._id}`} key={item._id}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500 transition-all">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {item.title}
                    </h3>
                    <p className="text-blue-500 font-bold mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerProfile;
