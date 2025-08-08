import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupplierKYC from "./pages/SupplierKYC";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierAvailableBids from "./components/SupplierAvailableBids";
import MyOffers from "./components/MyOffers";
import SupplierVerificationFailed from "./pages/supplier/SupplierVerificationFailed";

// School Pages
import SchoolDashboard from "./pages/SchoolDashboard";
import AvailableBids from "./pages/school/AvailableBids";
import PostBid from "./pages/school/PostBid";
import PaymentStatus from "./pages/school/PaymentStatus";
import PaymentCallback from "./pages/school/PaymentCallback";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import VerifySuppliers from "./pages/admin/VerifySuppliers";
import ViewBids from "./pages/admin/ViewBids";
import ManageUsers from "./pages/admin/ManageUsers";
// import Reports from "./pages/admin/Reports"; // optional

// Supplier Pages
import MyAwards from "./pages/supplier/MyAwards";
import Unauthorized from "./pages/Unauthorized";

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
    path: "/supplier/kyc/failed",
    element: (
      <ProtectedRoute roles={["supplier"]}>
        <SupplierVerificationFailed />
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
      { index: true, element: <AvailableBids /> },
      { path: "available-bids", element: <AvailableBids /> },
      { path: "post-bid", element: <PostBid /> },
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
      { index: true, element: <VerifySuppliers /> },
      { path: "verify-suppliers", element: <VerifySuppliers /> },
      { path: "view-bids", element: <ViewBids /> },
      { path: "manage-users", element: <ManageUsers /> },
      // { path: "reports", element: <Reports /> }, // optional
    ],
  },
  {
    path: "/supplier/dashboard",
    element: (
      <ProtectedRoute roles={["supplier"]} requireVerification={true}>
        <SupplierDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SupplierAvailableBids /> },
      { path: "available-bids", element: <SupplierAvailableBids /> },
      { path: "my-offers", element: <MyOffers /> },
      { path: "my-awards", element: <MyAwards /> },
      // Uncomment if you add PaymentStatus later
      // { path: "payment-status", element: <PaymentStatus /> },
    ],
  },
  {
    path: "/payment-callback",
    element: <PaymentCallback />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

export default router;
