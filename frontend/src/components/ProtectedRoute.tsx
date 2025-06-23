import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Optional: restrict by role
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (roles && (!role || !roles.includes(role)))
    return <Navigate to="/unauthorized" replace />;

  return children;
}
