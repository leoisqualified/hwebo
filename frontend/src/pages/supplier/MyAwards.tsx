import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AwardedOffer {
  id: string;
  pricePerUnit: number;
  totalPrice: number;
  notes: string;
  status: "pending" | "accepted" | "completed" | "rejected";
  deliveryTime: string;
  bidItem: {
    id: string;
    itemName: string;
    quantity: number;
    unit: string;
    bidRequest: {
      id: string;
      title: string;
      school: {
        name: string;
        location: string;
      };
    };
  };
  createdAt: string;
  delivery?: {
    id: string;
    status: "pending" | "in_progress" | "delivered" | "rejected";
  };
}

const statusConfig = {
  pending: {
    color: "bg-amber-50 text-amber-800",
    icon: <FiClock className="text-amber-500" />,
  },
  accepted: {
    color: "bg-emerald-50 text-emerald-800",
    icon: <FiCheckCircle className="text-emerald-500" />,
  },
  completed: {
    color: "bg-blue-50 text-blue-800",
    icon: <FiCheckCircle className="text-blue-500" />,
  },
  rejected: {
    color: "bg-red-50 text-red-800",
    icon: <FiCheckCircle className="text-red-500" />,
  },
};

export default function MyAwards() {
  const [awards, setAwards] = useState<AwardedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleMarkAsDelivered = async (deliveryId: string) => {
    try {
      await api.post("/delivery/complete", {
        deliveryId,
        notes: "Goods delivered as agreed.", // You could make this optional or add a modal
      });

      setToast({ message: "Marked as delivered.", type: "success" });

      // Refresh awarded offers
      const res = await api.get("/supplier-offers/my-awarded-offers");
      setAwards(res.data.awardedOffers);
    } catch (err) {
      console.error("Failed to mark as delivered", err);
      setToast({ message: "Failed to update delivery.", type: "error" });
    }
  };

  useEffect(() => {
    const fetchAwardedOffers = async () => {
      try {
        const res = await api.get("/supplier-offers/my-awarded-offers");
        setAwards(res.data.awardedOffers);
      } catch (err) {
        console.error("Failed to fetch awarded offers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwardedOffers();
  }, []);

  const filteredAwards =
    selectedFilter === "all"
      ? awards
      : awards.filter((offer) => offer.status === selectedFilter);

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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#059669]">
            Awarded Contracts
          </h1>
          <p className="text-gray-500 mt-1">
            {awards.length} total contracts · {filteredAwards.length} filtered
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedFilter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                selectedFilter === status
                  ? `${config.color
                      .replace("bg-", "bg-")
                      .replace("text-", "text-gray bg-")}`
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {config.icon}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredAwards.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-50 mb-4">
            <FiAward className="h-8 w-8 text-[#059669]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No contracts found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {selectedFilter === "all"
              ? "You haven't been awarded any contracts yet."
              : `You don't have any ${selectedFilter} contracts.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredAwards.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FiPackage className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {offer.bidItem.itemName}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {offer.bidItem.bidRequest.title}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {offer.bidItem.quantity} {offer.bidItem.unit}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {offer.bidItem.bidRequest.school.name}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {offer.bidItem.bidRequest.school.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        statusConfig[offer.status].color
                      }`}
                    >
                      {statusConfig[offer.status].icon}
                      <span className="ml-1.5">
                        {offer.status.charAt(0).toUpperCase() +
                          offer.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        GH₵ {offer.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {offer.pricePerUnit.toLocaleString()} per unit
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Awarded
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(offer.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <FiClock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery Time
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {offer.deliveryTime} days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <FiDollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Value
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          GH₵ {offer.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FiTruck className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </p>
                        <div className="flex gap-2">
                          {offer.delivery &&
                            offer.delivery?.status !== "delivered" && (
                              <button
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                onClick={() =>
                                  handleMarkAsDelivered(offer.delivery!.id)
                                }
                              >
                                Mark Delivered
                              </button>
                            )}
                          <pre>{JSON.stringify(offer.delivery?.status)}</pre>
                        </div>
                      </div>
                    </div>
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
