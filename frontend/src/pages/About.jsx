import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import API from '../api';

function About() {
  const navigate = useNavigate(); // Navigation hook
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
      alert("Delete failed: Forbidden. You can only delete your own reviews.");
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setNewReview(review.comment);
    // Smooth scroll to the input field
    const inputField = document.querySelector('input[name="reviewInput"]');
    inputField?.focus();
    inputField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-start mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-slate-500 hover:text-blue-500 text-sm flex items-center gap-2 transition-all font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Marketplace
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            About <span className="text-blue-500">Ramtek Bazar</span>
          </h1>
          <div className="space-y-12 text-left">
            <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
              <h2 className="text-2xl font-bold text-blue-500 mb-4">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                Ramtek Bazar was developed to bridge the gap between local buyers and sellers. 
                By removing middlemen and providing a direct platform, we empower the community 
                to trade everything from electronics to agri-tools with trust and transparency.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                <h3 className="text-blue-400 font-bold mb-2">Hyper-Local</h3>
                <p className="text-xs text-slate-400">Tailored specifically for the Ramtek area.</p>
              </div>
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                <h3 className="text-blue-400 font-bold mb-2">Secure Trading</h3>
                <p className="text-xs text-slate-400">Direct WhatsApp seller contact.</p>
              </div>
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                <h3 className="text-blue-400 font-bold mb-2">Zero Fees</h3>
                <p className="text-xs text-slate-400">100% free for all residents.</p>
              </div>
            </section>
          </div>
        </div>

        {/* Community Feedback Section */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
          
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            Community Feedback
          </h2>
          
          <div className="space-y-4 mb-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewerId = review.user?._id || review.user;
                const isReviewOwner = loggedInId && reviewerId && String(loggedInId) === String(reviewerId);

                return (
                  <div key={review._id} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-blue-400 text-sm uppercase tracking-wider">
                        {review.user?.name || "Member"}
                      </p>

                      {isReviewOwner && (
                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-yellow-500/80 hover:text-yellow-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-500/80 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 text-sm italic text-center py-10">No reviews yet. Be the first to share your experience!</p>
            )}
          </div>

          <form onSubmit={postReview} className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-800">
            <input 
              name="reviewInput"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all text-white placeholder:text-slate-600"
              placeholder={user ? (editingId ? "Correcting your review..." : "Tell the community what you think...") : "Login to join the conversation"}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={!user || isLoading}
            />
            <button 
              type="submit"
              disabled={!user || isLoading}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 ${
                user ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? "..." : (editingId ? "Update" : "Post")}
            </button>
          </form>

          {!user && (
            <p className="text-[10px] text-slate-500 mt-4 text-center sm:text-left flex items-center gap-2 font-bold uppercase tracking-tighter">
              <span>🔒</span> Access Restricted: Login required to post.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;a