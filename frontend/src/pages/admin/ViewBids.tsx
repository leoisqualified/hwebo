import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

interface Bid {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  school: {
    email: string;
    name?: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    offers: {
      id: string;
      supplier: {
        email: string;
      };
      pricePerUnit: number;
    }[];
  }[];
  createdAt: string;
}

export default function ViewBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get("/admin/bids");
        setBids(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch bids. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.school.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
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
        <h1 className="text-2xl font-bold text-[#1E3A8A]">All Bids</h1>

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
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
          </select>
        </div>
      </div>

      {filteredBids.length === 0 ? (
        <div className="p-8 text-center">
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
              : "There are currently no bids."}
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
                      {bid.school.name || bid.school.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>

                <p className="mt-3 text-gray-600 line-clamp-2">
                  {bid.description}
                </p>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-medium">{bid.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Offers</p>
                    <p className="font-medium">
                      {bid.items.reduce(
                        (sum, item) => sum + item.offers.length,
                        0
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-[#1E3A8A] mb-3">
                    Items Requested
                  </h3>
                  <div className="space-y-4">
                    {bid.items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                          <span className="text-sm bg-[#F3F4F6] px-2 py-1 rounded">
                            {item.offers.length} offers
                          </span>
                        </div>
                        {item.offers.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">
                              Lowest Offer:
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {Math.min(
                                  ...item.offers.map((o) => o.pricePerUnit)
                                ).toLocaleString(undefined, {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </span>
                              <span className="text-xs text-gray-500">
                                per unit
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
