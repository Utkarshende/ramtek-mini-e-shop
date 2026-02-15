import React, { useState, useEffect } from 'react';
import API from '../api';

function About() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Safe parsing of user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const fetchReviews = async () => {
    try {
      const response = await API.get('/reviews');
      // response.data is the Axios object, response.data.data is our array from backend
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
      await API.post('/reviews', { 
        user: user.name, 
        comment: newReview 
      });
      setNewReview("");
      fetchReviews(); // Refresh list after posting
    } catch (err) {
      alert("Failed to post review. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              reviews.map((r, i) => (
                <div key={i} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-1">{r.user}</p>
                  <p className="text-slate-300 text-sm italic">"{r.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm italic">No reviews yet. Be the first to say something!</p>
            )}
          </div>

          <form onSubmit={postReview} className="flex flex-col sm:flex-row gap-3">
            <input 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all"
              placeholder={user ? "Write your experience..." : "Login to post a review"}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={!user || isLoading}
            />
            <button 
              disabled={!user || isLoading}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                user ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </form>
          {!user && (
            <p className="text-xs text-slate-500 mt-3 text-center sm:text-left">
              🔒 You must be logged in to share feedback.
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