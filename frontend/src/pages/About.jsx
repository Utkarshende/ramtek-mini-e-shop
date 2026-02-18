import React, { useState, useEffect } from 'react';
import API from '../api';

function About() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Safe parsing of user - handles both .id and ._id formats
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
      alert("Action failed. You might not be authorized to edit this.");
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
      // If this fails with 403, it's a backend ownership mismatch
      alert("Delete failed: Forbidden. You can only delete your own reviews.");
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setNewReview(review.comment);
    // Scroll to input for better UX
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 tracking-tight">
          About <span className="text-blue-500">Ramtek Bazar</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-12">
          The hyper-local marketplace for the people of Ramtek. Buy, sell, and trade items 
          within your community with zero middleman and 100% transparency.
        </p>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left mb-16 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Community Feedback
          </h2>
          
          <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                // 2. LOGIC FIX: Extract reviewer ID safely
                const reviewerId = review.user?._id || review.user;
                // 3. LOGIC FIX: Compare strings to avoid Object vs String mismatch
                const isReviewOwner = loggedInId && reviewerId && String(loggedInId) === String(reviewerId);

                return (
                  <div key={review._id} className="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700 transition-all hover:border-slate-600">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-blue-400">{review.user?.name || "Anonymous"}</p>

                      {isReviewOwner && (
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-300 mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 text-sm italic">No reviews yet. Be the first to say something!</p>
            )}
          </div>

          <form onSubmit={postReview} className="flex flex-col sm:flex-row gap-3">
            <input 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all text-white shadow-inner"
              placeholder={user ? (editingId ? "Edit your review..." : "Write your experience...") : "Login to post a review"}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={!user || isLoading}
            />
            <button 
              type="submit"
              disabled={!user || isLoading}
              className={`px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                user ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? "Processing..." : (editingId ? "Update" : "Post")}
            </button>
          </form>

          {!user && (
            <p className="text-xs text-slate-500 mt-4 text-center sm:text-left flex items-center gap-2">
              <span>🔒</span> You must be logged in to share feedback.
            </p>
          )}
        </div>
      </div>

      <div className="mt-20 border-t border-slate-900 pt-10 text-center">
        <h3 className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Get in touch</h3>
        <p className="text-slate-300 hover:text-blue-500 transition-colors cursor-pointer font-medium">
          support@ramtekbazar.com
        </p>
      </div>
    </div>
  );
}

export default About;