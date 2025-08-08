import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedDashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const { role, verified, supplierProfile } = user;

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "school") {
      navigate("/school-dashboard");
    } else if (role === "supplier") {
      if (!supplierProfile) {
        // New supplier — no KYC submission yet
        navigate("/supplier/kyc");
      } else if (supplierProfile.verificationStatus === "failed") {
        // Failed verification — show message
        navigate("/supplier/kyc/failed");
      } else if (verified) {
        // Successfully verified supplier
        navigate("/supplier/dashboard");
      } else {
        // Default to form
        navigate("/supplier/kyc");
      }
    } else {
      navigate("/"); // fallback
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div>Loading...</div>;

  return null;
};

export default RoleBasedDashboardRedirect;
