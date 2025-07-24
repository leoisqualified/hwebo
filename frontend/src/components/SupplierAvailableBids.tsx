import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiPackage,
  FiDollarSign,
  FiEdit2,
  FiCheckCircle,
  FiChevronDown,
  FiCalendar,
  FiBook,
  FiLayers,
  FiAlertCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface BidItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category?: string;
  specifications?: string;
}

interface BidRequest {
  bidRequestId: string;
  title: string;
  description: string;
  deadline: string;
  school: string;
  schoolLocation?: string;
  items: BidItem[];
}

const SupplierAvailableBids = () => {
  const [bids, setBids] = useState<BidRequest[]>([]);
  const [offers, setOffers] = useState<
    Record<string, { pricePerUnit: string; notes: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [expandedBid, setExpandedBid] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    fetchAvailableBids();
  }, []);

  const fetchAvailableBids = async () => {
    try {
      const res = await api.get("/supplier-offers/available-bids");
      setBids(Array.isArray(res.data.bids) ? res.data.bids : []);
    } catch (error) {
      console.error("Error fetching available bids", error);
    }
  };

  const handleInputChange = (
    bidItemId: string,
    field: "pricePerUnit" | "notes",
    value: string
  ) => {
    setOffers((prev) => ({
      ...prev,
      [bidItemId]: {
        ...prev[bidItemId],
        [field]: value,
      },
    }));
  };

  const submitOffer = async (bidItemId: string) => {
    const { pricePerUnit, notes } = offers[bidItemId] || {};

    if (!pricePerUnit) {
      setToast({
        message: "Please enter a price per unit.",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/supplier-offers", {
        bidItemId,
        pricePerUnit: parseFloat(pricePerUnit),
        notes,
      });
      setToast({
        message: "Offer submitted successfully!",
        type: "success",
      });
      fetchAvailableBids();
    } catch (error: any) {
      console.error("Error submitting offer", error);
      setToast({
        message: error.response?.data?.error || "Error submitting offer",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleBidExpand = (bidId: string) => {
    setExpandedBid(expandedBid === bidId ? null : bidId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.school.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      bid.items.some((item) => item.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...new Set(
      bids.flatMap((bid) =>
        bid.items.map((item) => item.category).filter(Boolean)
      )
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
                : toast.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <div className="flex items-center">
              {toast.type === "success" ? (
                <FiCheckCircle className="mr-3 text-emerald-600" />
              ) : toast.type === "error" ? (
                <FiAlertCircle className="mr-3 text-red-600" />
              ) : (
                <FiAlertTriangle className="mr-3 text-amber-600" />
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#059669]">
            Available Procurement Bids
          </h1>
          <p className="text-gray-600 mt-1">
            Review and submit offers for current procurement requests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bids..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-[#059669] text-white rounded-md hover:bg-[#059669] transition-colors hover:cursor-pointer"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {filteredBids.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-50 mb-4">
              <FiPackage className="h-8 w-8 text-[#059669]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No bids found
            </h3>
            <p className="text-gray-500">
              {bids.length === 0
                ? "There are currently no active bids. Please check back later."
                : "No bids match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.bidRequestId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200"
              >
                <div
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between"
                  onClick={() => toggleBidExpand(bid.bidRequestId)}
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {bid.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-1 mt-1">
                      {bid.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-2 text-[#059669]" />
                      <span>Deadline: {formatDate(bid.deadline)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiBook className="mr-2 text-[#059669]" />
                      <span>{bid.school}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiLayers className="mr-2 text-[#059669]" />
                      <span>{bid.items.length} items</span>
                    </div>

                    <div
                      className={`transform transition-transform ${
                        expandedBid === bid.bidRequestId ? "rotate-180" : ""
                      }`}
                    >
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>

                {expandedBid === bid.bidRequestId && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-2">
                        Bid Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-700">{bid.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h5 className="font-medium text-gray-900 mb-2">
                            School Information
                          </h5>
                          <p className="text-gray-700">
                            <span className="font-medium">Institution:</span>{" "}
                            {bid.school}
                          </p>
                          {bid.schoolLocation && (
                            <p className="text-gray-700 mt-1">
                              <span className="font-medium">Location:</span>{" "}
                              {bid.schoolLocation}
                            </p>
                          )}
                          <p className="text-gray-700 mt-1">
                            <span className="font-medium">
                              Submission Deadline:
                            </span>{" "}
                            {formatDate(bid.deadline)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Requested Items
                    </h4>

                    <div className="space-y-4">
                      {bid.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                            <div>
                              <h5 className="font-semibold text-gray-900 flex items-center">
                                <FiPackage className="mr-2 text-[#059669]" />
                                {item.itemName}
                              </h5>
                              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                  Qty: {item.quantity} {item.unit}
                                </span>
                                {item.category && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                    Category: {item.category}
                                  </span>
                                )}
                              </div>
                              {item.specifications && (
                                <p className="text-gray-600 text-sm mt-2">
                                  <span className="font-medium">
                                    Specifications:
                                  </span>{" "}
                                  {item.specifications}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiDollarSign className="inline mr-1 text-[#059669]" />
                                Price per Unit (GH₵)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                                  value={offers[item.id]?.pricePerUnit || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.id,
                                      "pricePerUnit",
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="absolute left-3 top-2.5 text-gray-500">
                                  GH₵
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiEdit2 className="inline mr-1 text-[#059669]" />
                                Additional Notes (Optional)
                              </label>
                              <textarea
                                placeholder="Special notes about your offer..."
                                className="p-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                rows={2}
                                value={offers[item.id]?.notes || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    item.id,
                                    "notes",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => submitOffer(item.id)}
                            className="mt-4 bg-[#059669] hover:bg-[#047857] hover:cursor-pointer text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full sm:w-auto sm:px-6"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <FiCheckCircle className="mr-2" />
                                Submit Offer
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierAvailableBids;
