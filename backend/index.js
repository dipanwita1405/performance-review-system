const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* =================================================
   EMPLOYEE CRUD APIs (ADMIN)
================================================= */

// Create Employee
app.post("/api/employees", (req, res) => {
  const { name, email, role } = req.body;

  db.run(
    "INSERT INTO employee (name, email, role) VALUES (?, ?, ?)",
    [name, email, role],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, message: "Employee created successfully" });
    }
  );
});

// List Employees
app.get("/api/employees", (req, res) => {
  db.all("SELECT * FROM employee", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Update Employee
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  db.run(
    "UPDATE employee SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Employee updated successfully" });
    }
  );
});

// Delete Employee 
app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  // Remove dependent records first
  db.run("DELETE FROM assignment WHERE reviewer_id = ?", [id]);
  db.run("DELETE FROM feedback WHERE reviewer_id = ?", [id]);

  // Then delete employee
  db.run(
    "DELETE FROM employee WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json({ message: "Employee deleted successfully" });
    }
  );
});

/* =================================================
   REVIEW CRUD APIs (ADMIN)
================================================= */

// Create Review
app.post("/api/reviews", (req, res) => {
  const { employee_id, title } = req.body;

  db.run(
    "INSERT INTO review (employee_id, title, status) VALUES (?, ?, ?)",
    [employee_id, title, "open"],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, message: "Review created successfully" });
    }
  );
});

// List Reviews
app.get("/api/reviews", (req, res) => {
  db.all("SELECT * FROM review", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Update Review
app.put("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  db.run(
    "UPDATE review SET title = ?, status = ? WHERE id = ?",
    [title, status, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Review updated successfully" });
    }
  );
});

// Delete Review 
app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;

  // Remove dependent records first
  db.run("DELETE FROM assignment WHERE review_id = ?", [id]);
  db.run("DELETE FROM feedback WHERE review_id = ?", [id]);

  // Then delete review
  db.run(
    "DELETE FROM review WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json({ message: "Review deleted successfully" });
    }
  );
});

/* =================================================
   ASSIGN REVIEWER (ADMIN)
================================================= */

app.post("/api/assign-reviewer", (req, res) => {
  const { review_id, reviewer_id } = req.body;

  db.run(
    "INSERT INTO assignment (review_id, reviewer_id) VALUES (?, ?)",
    [review_id, reviewer_id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Reviewer assigned successfully" });
    }
  );
});

/* =================================================
   EMPLOYEE VIEW – REVIEWS REQUIRING FEEDBACK
================================================= */

app.get("/api/my-assignments/:employee_id", (req, res) => {
  const { employee_id } = req.params;

  db.all(
    `
    SELECT r.id, r.title, r.status, r.employee_id
    FROM review r
    JOIN assignment a ON r.id = a.review_id
    WHERE a.reviewer_id = ?
    `,
    [employee_id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* =================================================
   SUBMIT FEEDBACK (EMPLOYEE)
================================================= */

app.post("/api/feedback", (req, res) => {
  const { review_id, reviewer_id, rating, comment } = req.body;

  db.run(
    `
    INSERT INTO feedback (review_id, reviewer_id, rating, comment)
    VALUES (?, ?, ?, ?)
    `,
    [review_id, reviewer_id, rating, comment],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Feedback submitted successfully" });
    }
  );
});

/* =================================================
   ADMIN VIEW – ALL SUBMITTED FEEDBACK (BONUS)
================================================= */

app.get("/api/feedback", (req, res) => {
  db.all(
    `
    SELECT f.id, f.review_id, f.reviewer_id, f.rating, f.comment,
           e.name AS reviewer_name,
           r.title AS review_title
    FROM feedback f
    JOIN employee e ON f.reviewer_id = e.id
    JOIN review r ON f.review_id = r.id
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* =================================================
   START SERVER
================================================= */

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
