import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiChevronDown,
  FiSearch,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";

interface Bid {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  items: {
    id: string;
    itemName: string;
    quantity: number;
    unit: string;
    offers: {
      id: string;
      supplier: {
        username: string;
        companyName?: string;
      };
      pricePerUnit: number;
      totalPrice: number;
      notes: string;
      status: string;
      deliveryTime: string;
    }[];
  }[];
}

export default function AvailableBids() {
  const { token } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [expandedBid, setExpandedBid] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get("/bid-requests/my-bids", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBids(response?.data?.myBids ?? []);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token, refresh]);

  const handleSelectOffer = async () => {
    if (!selectedOfferId || !deliveryTime) {
      setToast({
        message: "Please enter delivery time",
        type: "error",
      });
      return;
    }

    try {
      await api.post(
        `/supplier-offers/select/${selectedOfferId}`,
        { deliveryTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ message: "Offer selected successfully!", type: "success" });
      setRefresh(!refresh);
      setShowModal(false);
      setDeliveryTime("");
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Error selecting offer.",
        type: "error",
      });
    }
  };

  const toggleBidExpansion = (bidId: string) => {
    setExpandedBid(expandedBid === bidId ? null : bidId);
  };

  const filteredBids = bids.filter(
    (bid) =>
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return "Closed";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `in ${diffDays} days`;
    }
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
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Confirm Delivery
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setDeliveryTime("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Time (days)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 7 for one week"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      min="1"
                    />
                    <FiClock className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setDeliveryTime("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSelectOffer}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <FiCheckCircle className="mr-2" />
                    Confirm Selection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#059669]">
            Available Bids
          </h1>
          <p className="text-gray-500 mt-1">
            Review and manage your procurement bids
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bids..."
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

      {/* Bid List */}
      {filteredBids.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <FiPackage className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No bids found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No bids match your search criteria."
              : "You haven't created any bids yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center"
                onClick={() => toggleBidExpansion(bid.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <FiCalendar size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-800 truncate">
                        {bid.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {bid.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-sm font-medium">
                      {new Date(bid.deadline).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      new Date(bid.deadline) < new Date()
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {formatDeadline(bid.deadline)}
                  </span>

                  <FiChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedBid === bid.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expandedBid === bid.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-6"
                  >
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2">
                            Description
                          </h3>
                          <p className="text-gray-600 whitespace-pre-line">
                            {bid.description}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-700 mb-2">
                            Bid Details
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <FiCalendar className="mr-2 text-emerald-600" />
                              <span>
                                Deadline:{" "}
                                {new Date(bid.deadline).toLocaleString(
                                  "en-US",
                                  {
                                    dateStyle: "full",
                                    timeStyle: "short",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiPackage className="mr-2 text-emerald-600" />
                              <span>
                                {bid.items.length}{" "}
                                {bid.items.length === 1 ? "item" : "items"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-4">
                        Requested Items
                      </h3>
                      <div className="space-y-4">
                        {bid.items.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800 flex items-center">
                                  <FiPackage className="mr-2 text-emerald-600" />
                                  {item.itemName}
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-sm font-medium text-gray-700 border border-[#FFD700]">
                                    Qty: {item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm bg-white px-2.5 py-0.5 rounded-full font-medium text-gray-700 border border-[#FFD700]">
                                {item.offers.length}{" "}
                                {item.offers.length === 1 ? "offer" : "offers"}
                              </span>
                            </div>

                            {item.offers.length > 0 ? (
                              <div className="mt-4 space-y-3">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                  Supplier Offers
                                </h4>
                                {item.offers.map((offer) => (
                                  <motion.div
                                    key={offer.id}
                                    whileHover={{ scale: 1.01 }}
                                    className={`p-4 rounded-lg border ${
                                      offer.status === "accepted"
                                        ? "border-emerald-200 bg-emerald-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {offer.supplier.companyName ||
                                            offer.supplier.username}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                                          <span className="flex items-center text-gray-600">
                                            <FiDollarSign className="mr-1 text-emerald-600" />
                                            GH₵
                                            {Number(offer.pricePerUnit).toFixed(
                                              2
                                            )}
                                            /unit
                                          </span>
                                          <span className="flex items-center text-gray-600">
                                            <FiDollarSign className="mr-1 text-emerald-600" />
                                            GH₵
                                            {(
                                              Number(offer.pricePerUnit) *
                                              item.quantity
                                            ).toFixed(2)}{" "}
                                            total
                                          </span>
                                          <span className="flex items-center text-gray-600">
                                            <FiClock className="mr-1 text-emerald-600" />
                                            {offer.deliveryTime} days
                                          </span>
                                        </div>
                                        {offer.notes && (
                                          <p className="text-sm text-gray-500 mt-2">
                                            <span className="font-medium">
                                              Notes:
                                            </span>{" "}
                                            {offer.notes}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span
                                          className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                                            offer.status === "accepted"
                                              ? "bg-emerald-100 text-emerald-800"
                                              : offer.status === "rejected"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-amber-100 text-amber-800"
                                          }`}
                                        >
                                          {offer.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            offer.status.slice(1)}
                                        </span>
                                        {new Date(bid.deadline) > new Date() &&
                                          offer.status === "pending" && (
                                            <motion.button
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedOfferId(offer.id);
                                                setShowModal(true);
                                              }}
                                              className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                                            >
                                              Select
                                            </motion.button>
                                          )}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-4 text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">
                                  No offers received yet
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
