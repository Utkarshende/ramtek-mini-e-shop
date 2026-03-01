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
    } catch {
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const postReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
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
    } catch {
      toast.error("Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await API.delete(`/reviews/${id}`);
      toast.success("Deleted");
      fetchReviews();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Community Feedback
        </h1>

        <div className="space-y-4 mb-10">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const reviewerId = review.user?._id;
              const isOwner =
                loggedInId &&
                reviewerId &&
                String(loggedInId) === String(reviewerId);

              return (
                <div
                  key={review._id}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      to={`/seller/${review.user?._id}`}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      {review.user?.name || "Unknown User"}
                    </Link>

                    {isOwner && (
                      <div className="flex gap-4 text-xs">
                        <button
                          onClick={() => {
                            setEditingId(review._id);
                            setNewReview(review.comment);
                          }}
                          className="text-yellow-400"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(review._id)
                          }
                          className="text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-300 italic">
                    "{review.comment}"
                  </p>

                  <p className="text-slate-500 text-xs mt-2">
                    Member since{" "}
                    {new Date(
                      review.user?.createdAt
                    ).getFullYear()}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500">
              No reviews yet.
            </p>
          )}
        </div>

        <form
          onSubmit={postReview}
          className="flex gap-3"
        >
          <input
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
            placeholder="Write your feedback..."
            value={newReview}
            onChange={(e) =>
              setNewReview(e.target.value)
            }
            disabled={!user || isLoading}
          />

          <button
            type="submit"
            disabled={!user || isLoading}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold"
          >
            {editingId ? "Update" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default About;