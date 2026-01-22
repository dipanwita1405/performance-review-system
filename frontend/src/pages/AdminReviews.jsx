import { useEffect, useState } from "react";
import api from "../api";

export default function AdminReviews() {
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Create / Edit Review states
  const [employeeId, setEmployeeId] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("open");
  const [editingId, setEditingId] = useState(null);

  // Assign reviewer states
  const [selectedReview, setSelectedReview] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get("/employees").then(res => setEmployees(res.data));
    api.get("/reviews").then(res => setReviews(res.data));
  };

  /* ================= CREATE REVIEW ================= */

  const createReview = () => {
    if (!employeeId || !title) {
      alert("Please select employee and enter title");
      return;
    }

    api.post("/reviews", { employee_id: employeeId, title }).then(() => {
      alert("Review created successfully");
      clearForm();
      loadData();
    });
  };

 

  const startEdit = (review) => {
    setEditingId(review.id);
    setEmployeeId(review.employee_id);
    setTitle(review.title);
    setStatus(review.status);
  };

  /* ================= UPDATE REVIEW ================= */

  const updateReview = () => {
    api.put(`/reviews/${editingId}`, { title, status }).then(() => {
      alert("Review updated successfully");
      clearForm();
      loadData();
    });
  };

  /* ================= DELETE REVIEW ================= */

  const deleteReview = (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    api.delete(`/reviews/${id}`).then(() => {
      alert("Review deleted successfully");
      loadData();
    });
  };

  /* ================= ASSIGN REVIEWER ================= */

  const assignReviewer = () => {
    if (!selectedReview || !selectedReviewer) {
      alert("Please select review and reviewer");
      return;
    }

    api.post("/assign-reviewer", {
      review_id: selectedReview,
      reviewer_id: selectedReviewer
    }).then(() => {
      alert("Reviewer assigned successfully");
    });
  };

  /* ================= CLEAR FORM ================= */

  const clearForm = () => {
    setEditingId(null);
    setEmployeeId("");
    setTitle("");
    setStatus("open");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin – Performance Reviews</h2>

      {/* ================= CREATE / UPDATE REVIEW ================= */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>{editingId ? "Update Review" : "Create Review"}</h3>

        <label>Employee Being Reviewed:</label><br />
        <select value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.id} - {emp.name}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Review Title:</label><br />
        <input
          value={title}
          placeholder="Enter review title"
          onChange={e => setTitle(e.target.value)}
        />

        <br /><br />

        {editingId && (
          <>
            <label>Status:</label><br />
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <br /><br />
          </>
        )}

        {editingId ? (
          <>
            <button onClick={updateReview}>Update</button>{" "}
            <button onClick={clearForm}>Cancel</button>
          </>
        ) : (
          <button onClick={createReview}>Create</button>
        )}
      </div>

      {/* ================= ASSIGN REVIEWER ================= */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>Assign Reviewer</h3>

        <label>Select Review:</label><br />
        <select value={selectedReview} onChange={e => setSelectedReview(e.target.value)}>
          <option value="">-- Select Review --</option>
          {reviews.map(r => (
            <option key={r.id} value={r.id}>
              {r.id} - {r.title}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Select Reviewer:</label><br />
        <select value={selectedReviewer} onChange={e => setSelectedReviewer(e.target.value)}>
          <option value="">-- Select Reviewer --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.id} - {emp.name}
            </option>
          ))}
        </select>

        <br /><br />
        <button onClick={assignReviewer}>Assign Reviewer</button>
      </div>

      {/* ================= REVIEWS TABLE ================= */}
      <h3>Performance Reviews</h3>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Employee ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.title}</td>
              <td>{r.employee_id}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>{" "}
                <button onClick={() => deleteReview(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
