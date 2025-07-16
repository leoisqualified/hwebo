import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiSearch,
  FiFileText,
  FiUser,
  FiDollarSign,
  FiPhone,
  FiCreditCard,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";

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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const FILE_BASE_URL = "http://localhost:5000/uploads/";

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
      setToast({ message: "Supplier approved successfully!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({
        message: "Failed to approve supplier. Please try again.",
        type: "error",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/admin/supplier/${id}/reject`);
      setRefreshKey((prev) => prev + 1);
      setToast({ message: "Supplier rejected successfully!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({
        message: "Failed to reject supplier. Please try again.",
        type: "error",
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start">
        <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg flex items-center justify-between z-50 ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {toast.type === "success" ? (
                <FiCheck className="mr-3 text-emerald-600" />
              ) : (
                <FiAlertCircle className="mr-3 text-red-600" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-current hover:text-opacity-70"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#059669]">
            Supplier Verification
          </h1>
          <p className="text-gray-500 mt-1">
            Review and verify new supplier applications
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search suppliers..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Supplier List */}
      {filteredSuppliers.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <FiUser className="h-8 w-8 text-[#059669]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No pending suppliers
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No suppliers match your search criteria."
              : "All supplier applications have been processed."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSuppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">
                            {supplier.businessName}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {supplier.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-500 flex items-center">
                        <FiCalendar className="mr-1" />
                        Applied on {formatDate(supplier.createdAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                          Registration Number
                        </p>
                        <p className="font-medium">
                          {supplier.registrationNumber}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                          Tax ID
                        </p>
                        <p className="font-medium">{supplier.taxId}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                          Contact Person
                        </p>
                        <p className="font-medium flex items-center">
                          <FiUser className="mr-2 text-emerald-600" />
                          {supplier.contactPerson}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                          Phone Number
                        </p>
                        <p className="font-medium flex items-center">
                          <FiPhone className="mr-2 text-emerald-600" />
                          {supplier.phoneNumber}
                        </p>
                      </div>
                      {supplier.momoNumber && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                            Mobile Money
                          </p>
                          <p className="font-medium flex items-center">
                            <FiDollarSign className="mr-2 text-emerald-600" />
                            {supplier.momoNumber}
                          </p>
                        </div>
                      )}
                      {supplier.bankAccount && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                            Bank Account
                          </p>
                          <p className="font-medium flex items-center">
                            <FiCreditCard className="mr-2 text-emerald-600" />
                            {supplier.bankAccount}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`${FILE_BASE_URL}${supplier.fdaLicenseUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiFileText className="mr-2 text-emerald-600" />
                        FDA License
                      </a>
                      <a
                        href={`${FILE_BASE_URL}${supplier.registrationCertificateUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiFileText className="mr-2 text-emerald-600" />
                        Registration Certificate
                      </a>
                      <a
                        href={`${FILE_BASE_URL}${supplier.ownerIdUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="mr-2 text-emerald-600" />
                        Owner ID
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 min-w-[120px]">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(supplier.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <FiCheck className="mr-2" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReject(supplier.id)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center"
                    >
                      <FiX className="mr-2" />
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
