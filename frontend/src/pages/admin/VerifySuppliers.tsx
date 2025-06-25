import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

interface SupplierProfile {
  id: string;
  user: {
    id: string;
    email: string;
  };
  businessName: string;
  registrationNumber: string;
  taxId: string;
  contactPerson: string;
  phoneNumber: string;
  momoNumber?: string;
  bankAccount?: string;
  fdaLicenseUrl: string;
  registrationCertificateUrl: string;
  ownerIdUrl: string;
  createdAt: string;
}

export default function VerifySuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/admin/pending-suppliers");
        setSuppliers(res.data);
      } catch (err: any) {
        setError("Failed to load suppliers. Please try again.");
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
      alert("Failed to approve supplier. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/admin/supplier/${id}/reject`);
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      alert("Failed to reject supplier. Please try again.");
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEE2E2] border border-[#DC2626] text-[#DC2626] p-4 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">
          Pending Supplier Approvals
        </h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search suppliers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="  p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No pending suppliers
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "No suppliers match your search."
              : "All suppliers have been processed."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSuppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-[#1E3A8A]">
                        {supplier.businessName}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {supplier.user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Registration Number
                        </p>
                        <p className="font-medium">
                          {supplier.registrationNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tax ID</p>
                        <p className="font-medium">{supplier.taxId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contact Person</p>
                        <p className="font-medium">{supplier.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="font-medium">{supplier.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mobile Money</p>
                        <p className="font-medium">
                          {supplier.momoNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bank Account</p>
                        <p className="font-medium">
                          {supplier.bankAccount || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={supplier.fdaLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-[#1E3A8A] hover:bg-gray-50"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        FDA License
                      </a>
                      <a
                        href={supplier.registrationCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-[#1E3A8A] hover:bg-gray-50"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Registration
                      </a>
                      <a
                        href={supplier.ownerIdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-[#1E3A8A] hover:bg-gray-50"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Owner ID
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 min-w-[120px]">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(supplier.id)}
                      className="px-4 py-2 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors font-medium"
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReject(supplier.id)}
                      className="px-4 py-2 bg-[#F3F4F6] text-[#DC2626] rounded-xl hover:bg-[#FEE2E2] transition-colors font-medium"
                    >
                      Reject
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
