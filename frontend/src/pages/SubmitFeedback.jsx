
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function SubmitFeedback() {
  const { reviewId, employeeId } = useParams();   // BOTH FROM URL
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const submitFeedback = () => {
    if (!rating || !comment) {
      alert("Please enter rating and comment");
      return;
    }

    api.post("/feedback", {
      review_id: reviewId,
      reviewer_id: employeeId,
      rating,
      comment
    }).then(() => {
      alert("Feedback submitted successfully");
      navigate(`/my-reviews/${employeeId}`);
    }).catch(err => {
      console.error(err);
      alert("Failed to submit feedback");
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit Feedback</h2>

      <p><b>Employee ID:</b> {employeeId}</p>
      <p><b>Review ID:</b> {reviewId}</p>

      <label>Rating (1 to 5):</label><br />
      <select value={rating} onChange={e => setRating(e.target.value)}>
        <option value="">-- Select Rating --</option>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Below Average</option>
        <option value="3">3 - Average</option>
        <option value="4">4 - Good</option>
        <option value="5">5 - Excellent</option>
      </select>

      <br /><br />

      <label>Comment:</label><br />
      <textarea
        rows="4"
        cols="40"
        placeholder="Write your feedback here"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <br /><br />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
}
