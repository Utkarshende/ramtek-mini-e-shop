import React, { useEffect, useState } from "react";
import API from "../api.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyListings() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const fetchMyProducts = async () => {
    try {
      setError("");
      const { data } = await API.get("/products/my-items");
      setMyProducts(data.data);
    } catch (err) {
      setError("Failed to load your listings.");
      toast.error("Unable to fetch your items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await API.delete(`/products/${id}`);

      setMyProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Listing removed successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete item."
      );
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-bold text-2xl">
          LOADING YOUR LISTINGS...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              My <span className="text-blue-500">Listings</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manage your active deals in Ramtek.
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
              Total Items
            </p>
            <span className="text-2xl font-mono text-white">
              {myProducts.length}
            </span>
          </div>
        </header>

        <div className="space-y-4">
          {myProducts.length > 0 ? (
            myProducts.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col md:flex-row items-center gap-6 bg-slate-900/50 border border-slate-800 p-5 rounded-3xl hover:bg-slate-900 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-full md:w-24 h-24 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-white text-lg font-bold group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                    <p className="text-blue-500 font-black text-xl">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </p>

                    <span className="text-slate-600 text-sm self-center">
                      |
                    </span>

                    <p className="text-slate-400 text-sm uppercase tracking-tight self-center">
                      {item.category}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <Link
                    to={`/product/${item._id}`}
                    className="flex-1 text-center px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="flex-1 text-center px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-900 rounded-[40px] bg-slate-900/20">
              <div className="text-5xl mb-4">📦</div>

              <p className="text-slate-400 text-lg mb-6">
                Your shop is empty. Ready to sell something?
              </p>

              <Link
                to="/sell"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/20"
              >
                LIST AN ITEM NOW
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyListings;