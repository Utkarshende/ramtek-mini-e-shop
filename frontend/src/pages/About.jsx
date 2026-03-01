import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";

function About() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const loggedInId = user?._id;

  const fetchReviews = async () => {
    try {
      const response = await API.get("/reviews");
      setReviews(response.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const postReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }

    if (!newReview.trim()) return;

    setIsLoading(true);

    try {
      if (editingId) {
        await API.put(`/reviews/${editingId}`, {
          comment: newReview,
        });
        toast.success("Review updated");
        setEditingId(null);
      } else {
        await API.post("/reviews", {
          comment: newReview,
        });
        toast.success("Review posted");
      }

      setNewReview("");
      fetchReviews();
    } catch (err) {
      toast.error("Action failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await API.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setNewReview(review.comment);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-start mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-blue-500 text-sm"
          >
            ← Back to Marketplace
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6">
            About <span className="text-blue-500">Ramtek Bazar</span>
          </h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h2 className="text-xl font-semibold mb-8">
            Community Feedback
          </h2>

          <div className="space-y-4 mb-8 max-h-[450px] overflow-y-auto pr-2">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewerId = review.user?._id;

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

                      <Link
                        to={`/seller/${review.user?._id}`}
                        className="font-bold text-blue-400 text-sm uppercase hover:text-blue-300"
                      >
                        {review.user?.name}
                      </Link>

                      {isReviewOwner && (
                        <div className="flex gap-4 text-xs font-bold uppercase">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm italic">
                      "{review.comment}"
                    </p>

                    {review.user?.createdAt && (
                      <p className="text-slate-500 text-xs mt-2">
                        Member since{" "}
                        {new Date(review.user.createdAt).getFullYear()}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 text-sm text-center py-10">
                No reviews yet.
              </p>
            )}
          </div>

          <form
            onSubmit={postReview}
            className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-800"
          >
            <input
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500"
              placeholder={
                editingId
                  ? "Editing your review..."
                  : "Tell the community what you think..."
              }
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={!user || isLoading}
            />

            <button
              type="submit"
              disabled={!user || isLoading}
              className="px-8 py-3 rounded-xl text-xs uppercase bg-blue-600 hover:bg-blue-500"
            >
              {editingId ? "Update" : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default About;