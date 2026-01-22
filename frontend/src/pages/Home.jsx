
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Performance Review System</h1>

      <br />

      {/* ADMIN */}
      <button
        style={{ padding: "10px 20px", marginBottom: "30px" }}
        onClick={() => navigate("/admin/employees")}
      >
        Login as Admin
      </button>

      <br /><br /><br />

      {/* EMPLOYEE */}
      <h3>Employee Login</h3>

      <input
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={e => setEmployeeId(e.target.value)}
      />

      <br /><br />

      <button
        onClick={() => {
          if (!employeeId) {
            alert("Please enter Employee ID");
            return;
          }
          navigate(`/my-reviews/${employeeId}`);
        }}
      >
        Login as Employee
      </button>
    </div>
  );
}
