import { useEffect, useState } from "react";
import api from "../../services/api";

interface SupplierProfile {
  id: string;
  companyName: string;
  documentUrl: string; // Assuming you store the KYC document URL
  user: {
    id: string;
    email: string;
  };
}

export default function VerifySuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // To refresh after action

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/admin/pending-suppliers");
        setSuppliers(res.data);
      } catch (err: any) {
        setError("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [refreshKey]);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/admin/supplier/${id}/verify`);
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      alert("Failed to approve supplier.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/admin/supplier/${id}/reject`);
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      alert("Failed to reject supplier.");
    }
  };

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Pending Supplier Approvals
      </h1>

      {suppliers.length === 0 ? (
        <p>No pending suppliers at the moment.</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{supplier.user.email}</p>
                <p>Company: {supplier.companyName}</p>
                <a
                  href={supplier.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View KYC Document
                </a>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(supplier.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(supplier.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
