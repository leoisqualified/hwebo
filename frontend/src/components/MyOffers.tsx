import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  FiClock,
  FiPackage,
  FiDollarSign,
  FiEdit2,
  FiCheckCircle,
  FiChevronDown,
} from "react-icons/fi";
import { FaSpinner, FaSchool } from "react-icons/fa";

interface BidItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category?: string;
}

interface BidRequest {
  bidRequestId: string;
  title: string;
  description: string;
  deadline: string;
  school: string;
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
      alert("Please enter a price per unit.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/supplier", {
        bidItemId,
        pricePerUnit: parseFloat(pricePerUnit),
        notes,
      });
      alert("Offer submitted successfully!");
      fetchAvailableBids();
    } catch (error: any) {
      console.error("Error submitting offer", error);
      alert(error.response?.data?.error || "Error submitting offer");
    } finally {
      setLoading(false);
    }
  };

  const toggleBidExpand = (bidId: string) => {
    setExpandedBid(expandedBid === bidId ? null : bidId);
  };

  const filteredBids = bids.filter(
    (bid) =>
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Available Bids</h1>

        <div className="relative max-w-md w-full">
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
            placeholder="Search bids..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBids.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
            No bids found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "No bids match your search criteria."
              : "There are currently no available bids."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.bidRequestId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                onClick={() => toggleBidExpand(bid.bidRequestId)}
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[#1E3A8A]">
                    {bid.title}
                  </h3>
                  <p className="text-gray-500 line-clamp-1">
                    {bid.description}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <div className="flex items-center text-sm text-[#059669]">
                      <FiClock className="mr-1.5" />
                      <span>
                        Deadline: {new Date(bid.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-[#059669]">
                      <FaSchool className="mr-1.5" />
                      <span>{bid.school}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">
                    {bid.items.length}{" "}
                    {bid.items.length === 1 ? "item" : "items"}
                  </span>
                  <FiChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedBid === bid.bidRequestId
                        ? "transform rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </div>

              {expandedBid === bid.bidRequestId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 px-6 py-4"
                >
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-[#1E3A8A] mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700">{bid.description}</p>
                  </div>

                  <h4 className="text-md font-medium text-[#1E3A8A] mb-4">
                    Items Requested
                  </h4>
                  <div className="space-y-4">
                    {bid.items.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ backgroundColor: "#F9FAFB" }}
                        className="p-4 border border-gray-200 rounded-lg bg-white transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-[#1E3A8A] flex items-center">
                              <FiPackage className="mr-2 text-[#FBBF24]" />
                              {item.itemName}
                            </h5>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm">
                              <span className="text-gray-700">
                                <span className="font-medium">Quantity:</span>{" "}
                                {item.quantity} {item.unit}
                              </span>
                              {item.category && (
                                <span className="text-gray-700">
                                  <span className="font-medium">Category:</span>{" "}
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                              <FiDollarSign className="mr-1.5 text-[#059669]" />
                              Price per Unit
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="0.00"
                                className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                                value={offers[item.id]?.pricePerUnit || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    item.id,
                                    "pricePerUnit",
                                    e.target.value
                                  )
                                }
                              />
                              <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                              <FiEdit2 className="mr-1.5 text-[#059669]" />
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              placeholder="Any special notes about your offer..."
                              className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
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

                          <button
                            onClick={() => submitOffer(item.id)}
                            className="mt-2 bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto sm:px-6"
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
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierAvailableBids;
