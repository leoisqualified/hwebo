import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Optional: restrict by role
  requireVerification?: boolean;
}

export default function ProtectedRoute({
  children,
  roles,
  requireVerification = false,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  // Handle verification logic
  if (requireVerification && user.role === "supplier" && !user.verified) {
    return <Navigate to="/supplier/kyc" replace />;
  }

  return children;
}
