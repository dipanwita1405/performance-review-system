
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function MyReviews() {
  // GET EMPLOYEE ID FROM URL
  const { employeeId } = useParams();

  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyReviews();
  }, [employeeId]);

  const loadMyReviews = () => {
    api.get(`/my-assignments/${employeeId}`)
      .then(res => setReviews(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load assigned reviews");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Assigned Performance Reviews</h2>
      <p><b>Logged in as Employee ID:</b> {employeeId}</p>

      {reviews.length === 0 ? (
        <p>No reviews assigned for feedback.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Employee Being Reviewed</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.status}</td>
                <td>{r.employee_id}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/feedback/${r.id}/${employeeId}`)
                    }
                  >
                    Give Feedback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
