import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function About() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const loggedInId = user?.id || user?._id;

  const fetchReviews = async () => {
    try {
      const response = await API.get('/reviews');
      setReviews(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const postReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review");
    if (!newReview.trim()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        await API.put(`/reviews/${editingId}`, { comment: newReview });
        setEditingId(null);
      } else {
        await API.post('/reviews', { comment: newReview });
      }

      setNewReview("");
      fetchReviews();
    } catch (err) {
      alert("Action failed. You might not be authorized.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await API.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert("Delete failed. You can only delete your own reviews.");
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setNewReview(review.comment);

    const inputField = document.querySelector('input[name="reviewInput"]');
    inputField?.focus();
    inputField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-start mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-blue-500 text-sm flex items-center gap-2 transition-all font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Marketplace
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            About <span className="text-blue-500">Ramtek Bazar</span>
          </h1>
        </div>
{!user && (
  <div className="mb-12 bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-800/40 p-8 rounded-3xl shadow-xl">
    
    <h2 className="text-3xl font-bold text-blue-400 mb-4">
      Welcome to Ramtek Bazar 🏪
    </h2>

    <p className="text-slate-300 leading-relaxed mb-6">
      Ramtek Bazar is a hyper-local marketplace built for the people of Ramtek.
      Buy and sell electronics, vehicles, furniture, agri-tools and more —
      directly with real sellers through WhatsApp.
    </p>

    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        🔎 Browse local products
      </div>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        💬 Contact sellers instantly
      </div>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        🆓 No commission. No middleman.
      </div>
    </div>

    <button
      onClick={() => navigate('/login')}
      className="mt-6 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm "
    >
      Login to Start Trading
    </button>

  </div>
)}

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left shadow-2xl relative overflow-hidden">
          <h2 className="text-xl font-semibold mb-8">
            Community Feedback
          </h2>

          <div className="space-y-4 mb-8 max-h-[450px] overflow-y-auto pr-2">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewerId = review.user?._id || review.user;
                const isReviewOwner =
                  loggedInId &&
                  reviewerId &&
                  String(loggedInId) === String(reviewerId);

                return (
                  <div
                    key={review._id}
                    className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-blue-400 text-sm uppercase tracking-wider">
                        {review.user?.name || "Member"}
                      </p>

                      {isReviewOwner && (
                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-yellow-500/80 hover:text-yellow-400"
                          >
                            Edit
                          </button>

                          {/* ✅ FIX IS HERE */}
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-500/80 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 text-sm italic text-center py-10">
                No reviews yet.
              </p>
            )}
          </div>

          <form onSubmit={postReview} className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-800">
            <input
              name="reviewInput"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 text-white"
              placeholder={
                user
                  ? editingId
                    ? "Correcting your review..."
                    : "Tell the community what you think..."
                  : "Login to join the conversation"
              }
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={!user || isLoading}
            />

            <button
              type="submit"
              disabled={!user || isLoading}
              className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isLoading ? "..." : editingId ? "Update" : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default About;
