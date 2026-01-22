
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/admin/employees">Employees</Link> |{" "}
        <Link to="/admin/reviews">Admin Reviews</Link>
      </nav>

      {/* Child pages will appear here */}
      <Outlet />
    </div>
  );
}
