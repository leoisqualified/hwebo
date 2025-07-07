import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

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

  const handleSelectOffer = async (offerId: string) => {
    try {
      await api.post(
        `/school/select-offer/${offerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Offer selected successfully!");
      setRefresh(!refresh);
    } catch (error: any) {
      console.error("Error selecting offer:", error);
      alert(error.response?.data?.message || "Error selecting offer.");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Available Bids</h1>

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
            placeholder="Search bids..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBids.length === 0 ? (
        <div className="bg-white p-8 text-center">
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
              ? "No bids match your search."
              : "You haven't created any bids yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleBidExpansion(bid.id)}
              >
                <div>
                  <h2 className="text-lg font-bold text-[#1E3A8A]">
                    {bid.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {bid.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      new Date(bid.deadline) < new Date()
                        ? "bg-[#FEF3C7] text-[#D97706]"
                        : "bg-[#D1FAE5] text-[#059669]"
                    }`}
                  >
                    {new Date(bid.deadline) < new Date() ? "Closed" : "Active"}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedBid === bid.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {expandedBid === bid.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="border-t pt-4">
                    <p className="text-gray-700 mb-4">{bid.description}</p>

                    <div className="mb-4 flex items-center space-x-4">
                      <div>
                        <p className="text-xs text-red-500">Deadline</p>
                        <p className="font-medium">
                          {new Date(bid.deadline).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        {/* <p className="text-xs text-gray-500">Status</p> */}
                        <p className="font-medium capitalize">{bid.status}</p>
                      </div>
                    </div>

                    <h3 className="font-semibold text-[#1E3A8A] mb-3">Items</h3>
                    <div className="space-y-6">
                      {bid.items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.itemName}</h4>
                              <p className="text-sm text-gray-500">
                                {item.quantity} {item.unit}
                              </p>
                            </div>
                            <span className="text-sm bg-[#F3F4F6] px-2 py-1 rounded">
                              {item.offers.length} offers
                            </span>
                          </div>

                          {item.offers.length > 0 ? (
                            <div className="mt-4 space-y-3">
                              {item.offers.map((offer) => (
                                <div
                                  key={offer.id}
                                  className={`p-3 rounded-lg border ${
                                    offer.status === "accepted"
                                      ? "border-[#059669] bg-[#ECFDF5]"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">
                                        {offer.supplier.companyName ||
                                          offer.supplier.username}
                                      </p>
                                      <div className="flex space-x-4 mt-1 text-sm">
                                        <span>
                                          GH₵
                                          {Number(offer.pricePerUnit).toFixed(
                                            2
                                          )}
                                          /unit
                                        </span>
                                        <span>
                                          GH₵{" "}
                                          {Number(offer.pricePerUnit).toFixed(
                                            2
                                          )}{" "}
                                          total
                                        </span>
                                        <span>{offer.deliveryTime}</span>
                                      </div>
                                      {offer.notes && (
                                        <p className="text-sm text-gray-500 mt-1">
                                          Notes: {offer.notes}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                                          offer.status === "accepted"
                                            ? "bg-[#D1FAE5] text-[#059669]"
                                            : offer.status === "rejected"
                                            ? "bg-[#FEE2E2] text-[#DC2626]"
                                            : "bg-[#FEF3C7] text-[#D97706]"
                                        }`}
                                      >
                                        {String(offer.status || "unknown")
                                          .charAt(0)
                                          .toUpperCase() +
                                          String(
                                            offer.status || "unknown"
                                          ).slice(1)}
                                      </span>
                                      {new Date(bid.deadline) < new Date() &&
                                        offer.status === "pending" && (
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                              handleSelectOffer(offer.id)
                                            }
                                            className="px-3 py-1 bg-[#059669] text-white text-sm rounded-lg hover:bg-[#047857] transition-colors"
                                          >
                                            Select
                                          </motion.button>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-4 text-center py-4 bg-gray-50 rounded-lg">
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
