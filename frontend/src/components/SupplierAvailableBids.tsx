import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiClock,
  FiPackage,
  FiDollarSign,
  FiEdit2,
  FiCheckCircle,
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

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Available Bids</h1>
          <p className="text-[#059669]">
            Browse and submit offers for current procurement requests
          </p>
        </header> */}

        {bids.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-[#FBBF24] text-5xl mb-4">
              <FiPackage className="inline-block" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
              No available bids
            </h3>
            <p className="text-[#1E3A8A]">
              There are currently no active bids. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <div
                key={bid.bidRequestId}
                className="bg-white rounded-lg shadow overflow-hidden transition-all duration-200"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleBidExpand(bid.bidRequestId)}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E3A8A]">
                      {bid.title}
                    </h3>
                    <p className="text-[#1E3A8A] line-clamp-1">
                      {bid.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-[#059669]">
                      <FiClock className="mr-1" />
                      <span>{new Date(bid.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#059669]">
                      <FaSchool className="mr-1" />
                      <span>{bid.school}</span>
                    </div>
                    <div
                      className={`transform transition-transform ${
                        expandedBid === bid.bidRequestId ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-[#1E3A8A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedBid === bid.bidRequestId && (
                  <div className="border-t border-[#F3F4F6] p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-[#1E3A8A] mb-2">
                        Description
                      </h4>
                      <p className="text-[#1E3A8A]">{bid.description}</p>
                    </div>

                    <h4 className="text-lg font-medium text-[#1E3A8A] mb-4">
                      Items Requested
                    </h4>
                    <div className="space-y-4">
                      {bid.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border border-[#F3F4F6] rounded-lg bg-[#F9FAFB]"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-[#1E3A8A] flex items-center">
                                <FiPackage className="mr-2 text-[#FBBF24]" />
                                {item.itemName}
                              </h5>
                              <div className="flex space-x-4 mt-1 text-sm">
                                <span className="text-[#1E3A8A]">
                                  <span className="font-medium">Qty:</span>{" "}
                                  {item.quantity} {item.unit}
                                </span>
                                {item.category && (
                                  <span className="text-[#1E3A8A]">
                                    <span className="font-medium">
                                      Category:
                                    </span>{" "}
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-[#1E3A8A] mb-1 flex items-center">
                              <FiDollarSign className="mr-1 text-[#059669]" />
                              Price per Unit
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="0.00"
                                className="pl-8 pr-4 py-2 border border-[#E5E7EB] rounded-lg w-full focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
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

                          <div className="mt-3">
                            <label className="block text-sm font-medium text-[#1E3A8A] mb-1 flex items-center">
                              <FiEdit2 className="mr-1 text-[#059669]" />
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              placeholder="Any special notes about your offer..."
                              className="p-3 border border-[#E5E7EB] rounded-lg w-full focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
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
                            className="mt-4 bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto sm:px-6"
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
