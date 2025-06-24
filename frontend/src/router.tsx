import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupplierKYC from "./pages/SupplierKYC";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";
import SupplierAvailableBids from "./components/SupplierAvailableBids";
import MyOffers from "./components/MyOffers";

// School Pages
import SchoolDashboard from "./pages/SchoolDashboard";
import AvailableBids from "./pages/school/AvailableBids";
import PostBid from "./pages/school/PostBid";
import MyBids from "./pages/school/MyBids";
import PaymentStatus from "./pages/school/PaymentStatus";

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
    path: "/supplier/available-bids",
    element: (
      <ProtectedRoute roles={["supplier"]} requireVerification={true}>
        <SupplierAvailableBids />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier/my-offers",
    element: (
      <ProtectedRoute roles={["supplier"]} requireVerification={true}>
        <MyOffers />
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
]);

export default router;
