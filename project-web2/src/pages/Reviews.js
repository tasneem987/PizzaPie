import React, { useState, useEffect } from "react";
import "../styles/Reviews.css";
import api from "../api/axios";

// Fixed reviews
const fixedReviews = [
  {
    name: "Emma Johnson",
    review: "The best pizza I've ever tasted! The crust is perfectly crispy, and the toppings are so fresh. Highly recommend!",
  },
  {
    name: "Liam Smith",
    review: "Absolutely delicious! The cheese blend is amazing, and the sauce has the perfect amount of zest. Will definitely order again.",
  },
  {
    name: "Olivia Brown",
    review: "I can't get enough of this pizza. The flavors are incredible, and the ingredients are top-notch. Five stars!",
  },
];

const Reviews = () => {
  const [dbReviews, setDbReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews");
        setDbReviews(res.data);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setError("Failed to load reviews");
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    if (!loggedUser) {
      setError("You must be logged in to submit a review.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/reviews", {
        user_id: loggedUser.id,
        name: loggedUser.name,
        review: reviewText.trim(),
      });

      // Add to local state instantly
      setDbReviews([{ name: loggedUser.name, review: reviewText.trim() }, ...dbReviews]);
      setReviewText("");
      alert("Thank you for your review! ❤️"); // success alert
    } catch (err) {
      console.error("Add review error:", err);
      setError("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
  if (!loggedUser) return;

  if (!window.confirm("Are you sure you want to delete this review?")) return;

  try {
    await api.delete(`/reviews/${reviewId}`, {
      data: { user_id: loggedUser.id },
    });

    // Remove from UI instantly
    setDbReviews(dbReviews.filter((r) => r.id !== reviewId));
  } catch (err) {
    console.error("Delete review error:", err);
    setError("Failed to delete review");
  }
};


  return (
    <section className="reviews" id="reviews">
      <div className="heading">
        <span>Reviews</span>
        <h2>What Our Customers Say</h2>
      </div>
      {/* Fixed reviews */}
      <div className="fixed-reviews">
        {fixedReviews.map((r, i) => (
          <div key={i} className="fixed-review">
            <h4>{r.name}</h4>
            <p>{r.review}</p>
          </div>
        ))}
      </div>
      {/* User review form */}
      <div className="review-form">
        {loggedUser ? (
          <>
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                rows="4"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </>
        ) : (
          <p className="error-msg">❌ You must be logged in to submit a review.</p>
        )}
      </div>

     {/* Database reviews */}
<div className="reviews-container">
  {dbReviews.length === 0 ? (
    <p>No reviews yet. Be the first to add one! 🍕</p>
  ) : (
    dbReviews.map((r) => (
      <div key={r.id} className="review">
        <h4>{r.name}</h4>
        <p>{r.review}</p>

        {/* Show delete button ONLY for owner */}
        {loggedUser && loggedUser.id === r.user_id && (
          <button
            className="delete-review-btn"
            onClick={() => handleDelete(r.id)}
          >
            ❌ Delete
          </button>
        )}
      </div>
    ))
  )}
</div>
      {error && <p className="error-msg">{error}</p>}
    </section>
  );
};

export default Reviews;
