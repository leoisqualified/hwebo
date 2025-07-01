import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

interface BidItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  description?: string;
}

interface Bid {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status?: "draft" | "published" | "closed" | "awarded" | string | null;
  items: BidItem[];
  createdAt: string;
  offersCount: number;
}

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await api.get("/bid-requests/my-bids");
        setBids(response.data.myBids);
      } catch (error) {
        console.error("Failed to fetch bids", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | undefined | null) => {
    switch (status) {
      case "published":
        return "bg-[#D1FAE5] text-[#059669]";
      case "closed":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "awarded":
        return "bg-[#EDE9FE] text-[#7C3AED]";
      case "draft":
        return "bg-[#FEF3C7] text-[#D97706]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string | undefined | null) => {
    if (typeof status === "string" && status.trim() !== "") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    return "Unknown";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">My Bids</h1>
          <p className="text-gray-500">Manage your procurement requests</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
          </select>
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
            {searchTerm || statusFilter !== "all"
              ? "No bids match your criteria."
              : "You haven't created any bids yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-[#1E3A8A]">
                      {bid.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {formatStatus(bid.status)}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">{bid.description}</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="font-medium">
                      {new Date(bid.deadline).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-medium">{bid.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Offers</p>
                    <p className="font-medium">{bid.offersCount || 0}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-[#1E3A8A] mb-2">
                    Items Requested
                  </h3>
                  <div className="space-y-2">
                    {bid.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded-xl hover:bg-[#1E3A8A] hover:text-white transition-colors"
                  >
                    View Details
                  </motion.button>
                  {bid.status === "draft" && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                    >
                      Publish
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
