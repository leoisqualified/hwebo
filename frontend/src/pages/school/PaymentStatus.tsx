import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiLoader,
  FiCalendar,
  FiTruck,
  FiBox,
  FiX,
} from "react-icons/fi";

interface Payment {
  id: string;
  deliveryId: string;
  bidItem: {
    itemName: string;
    quantity: number;
    unit: string;
  };
  supplier: {
    email: string;
    companyName?: string;
  };
  pricePerUnit: number;
  totalAmount: number;
  paymentStatus: "pending" | "processing" | "completed" | "failed";
  paymentDate?: string;
  awardedDate: string;
}

export default function PaymentStatus() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { token } = useAuth();

  const handlePayNow = async (deliveryId: string) => {
    try {
      const res = await api.post(
        "/payment/initiate",
        {
          deliveryId,
          paymentMethod: "bank_card",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { authorizationUrl } = res.data;
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error("Error initiating payment", error);
      setToast({
        message: "Failed to initiate payment. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/supplier-offers/school-payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data.awardedOffers);
      } catch (error) {
        console.error("Error fetching payments", error);
        setToast({
          message: "Failed to load payments. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.bidItem.itemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="mr-1.5" />;
      case "processing":
        return <FiLoader className="mr-1.5 animate-spin" />;
      case "failed":
        return <FiAlertCircle className="mr-1.5" />;
      case "pending":
      default:
        return <FiClock className="mr-1.5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
                <FiCheckCircle className="mr-3 text-emerald-600" />
              ) : (
                <FiAlertCircle className="mr-3 text-red-600" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-current hover:text-opacity-70"
            >
              <FiX className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#059669]">
            Payment Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage supplier payments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search payments..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payment List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <FiDollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No payments found
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No payments match your criteria."
              : "You have no awarded offers yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FiBox className="mr-1.5" />
                      <span>Item</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FiTruck className="mr-1.5" />
                      <span>Supplier</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FiDollarSign className="mr-1.5" />
                      <span>Unit Price</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FiCalendar className="mr-1.5" />
                      <span>Awarded Date</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {payment.bidItem.itemName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {payment.supplier.companyName || payment.supplier.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {payment.bidItem.quantity} {payment.bidItem.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {formatCurrency(payment.pricePerUnit)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-emerald-600">
                        {formatCurrency(payment.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.awardedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(
                            payment.paymentStatus
                          )}`}
                        >
                          {getStatusIcon(payment.paymentStatus)}
                          {payment.paymentStatus.charAt(0).toUpperCase() +
                            payment.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {payment.paymentStatus === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePayNow(payment.deliveryId)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Pay Now
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
