import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SchoolDashboard from "./pages/SchoolDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";

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
]);

export default router;
