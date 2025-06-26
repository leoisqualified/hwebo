import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupplierKYC from "./pages/SupplierKYC";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierAvailableBids from "./components/SupplierAvailableBids";
import MyOffers from "./components/MyOffers";

// School Pages
import SchoolDashboard from "./pages/SchoolDashboard";
import AvailableBids from "./pages/school/AvailableBids";
import PostBid from "./pages/school/PostBid";
import MyBids from "./pages/school/MyBids";
import PaymentStatus from "./pages/school/PaymentStatus";
// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import VerifySuppliers from "./pages/admin/VerifySuppliers";
import ViewBids from "./pages/admin/ViewBids";
import ManageUsers from "./pages/admin/ManageUsers";
// import Reports from "./pages/admin/Reports"; // optional

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <RoleBasedDashboardRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier/kyc",
    element: (
      <ProtectedRoute roles={["supplier"]}>
        <SupplierKYC />
      </ProtectedRoute>
    ),
  },
  {
    path: "/school-dashboard",
    element: (
      <ProtectedRoute roles={["school"]}>
        <SchoolDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "available-bids", element: <AvailableBids /> },
      { path: "post-bid", element: <PostBid /> },
      { path: "my-bids", element: <MyBids /> },
      { path: "payment-status", element: <PaymentStatus /> },
    ],
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "verify-suppliers", element: <VerifySuppliers /> },
      { path: "view-bids", element: <ViewBids /> },
      { path: "manage-users", element: <ManageUsers /> },
      // { path: "reports", element: <Reports /> }, // optional
    ],
  },
  {
    path: "/supplier-dashboard",
    element: (
      <ProtectedRoute roles={["supplier"]} requireVerification={true}>
        <SupplierDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "available-bids", element: <SupplierAvailableBids /> },
      { path: "my-offers", element: <MyOffers /> },
      // Uncomment if you add PaymentStatus later
      // { path: "payment-status", element: <PaymentStatus /> },
    ],
  },
]);

export default router;
