
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEmployees from "./pages/AdminEmployees";
import AdminReviews from "./pages/AdminReviews";
import MyReviews from "./pages/MyReviews";
import SubmitFeedback from "./pages/SubmitFeedback";

export default function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route path="/" element={<Home />} />

      {/* ADMIN SECTION */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      {/* EMPLOYEE SECTION */}
      <Route path="/my-reviews/:employeeId" element={<MyReviews />} />
      <Route path="/feedback/:reviewId/:employeeId" element={<SubmitFeedback />} />
    </Routes>
  );
}
