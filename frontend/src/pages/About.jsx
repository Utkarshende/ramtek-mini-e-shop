import React, { useState, useEffect } from 'react';
import API from '../api';

function About() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchReviews = async () => {
    const { data } = await API.get('/reviews');
    setReviews(data);
  };

  useEffect(() => { fetchReviews(); }, []);

  const postReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review");
    await API.post('/reviews', { user: user.name, comment: newReview });
    setNewReview("");
    fetchReviews();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About <span className="text-blue-500">Ramtek Bazar</span></h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-12">
          The hyper-local marketplace for the people of Ramtek. Buy, sell, and trade items 
          within your community with zero middleman and 100% transparency.
        </p>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-left mb-16">
          <h2 className="text-xl font-semibold mb-4">Live Community Feedback</h2>
          <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-slate-800 pb-3">
                <p className="text-blue-400 text-sm font-bold">{r.user}</p>
                <p className="text-slate-300 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>

          <form onSubmit={postReview} className="flex gap-2">
            <input 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-all"
              placeholder="Write a review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <button className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500">Post</button>
          </form>
        </div>
      </div>
      <div className="mt-20 border-t border-slate-900 pt-10 text-center">
  <h3 className="text-slate-400 uppercase tracking-[0.2em] text-xs mb-4">Get in touch</h3>
  <p className="text-white hover:text-blue-500 transition-colors cursor-pointer">support@ramtekbazar.com</p>
</div>
    </div>
  );
}

export default About;