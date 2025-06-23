import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleBasedDashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />; // redirect to login if not authenticated

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    case "supplier":
      return <Navigate to="/supplier-dashboard" replace />;
    case "school":
      return <Navigate to="/school-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
