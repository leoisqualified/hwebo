import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiFileText,
  FiBox,
  FiAward,
  FiDollarSign,
  FiAlertCircle,
  FiClock,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

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
  const [expandedBid, setExpandedBid] = useState<string | null>(null);

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
        return "bg-emerald-100 text-emerald-800";
      case "closed":
        return "bg-blue-100 text-blue-800";
      case "awarded":
        return "bg-purple-100 text-purple-800";
      case "draft":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleBidExpansion = (bidId: string) => {
    setExpandedBid(expandedBid === bidId ? null : bidId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "Ends tomorrow";
    return `Ends in ${diffDays} days`;
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
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#059669]">
            Bid Management
          </h1>
          <p className="text-gray-500 mt-1">
            Review and manage all procurement bids
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bids..."
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
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
          </select>
        </div>
      </div>

      {/* Bid List */}
      {filteredBids.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <FiFileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No bids found
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No bids match your criteria."
              : "There are currently no bids."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center"
                onClick={() => toggleBidExpansion(bid.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <FiFileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-800 truncate">
                        {bid.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {bid.school.name || bid.school.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-sm font-medium">
                      {formatRelativeTime(bid.deadline)}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
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
                              <span>Deadline: {formatDate(bid.deadline)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiClock className="mr-2 text-emerald-600" />
                              <span>Created: {formatDate(bid.createdAt)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiBox className="mr-2 text-emerald-600" />
                              <span>
                                {bid.items.length}{" "}
                                {bid.items.length === 1 ? "item" : "items"}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiAward className="mr-2 text-emerald-600" />
                              <span>
                                {bid.items.reduce(
                                  (sum, item) => sum + item.offers.length,
                                  0
                                )}{" "}
                                total offers
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
                                  <FiBox className="mr-2 text-emerald-600" />
                                  {item.name}
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-sm font-medium text-gray-700 border border-[#FDD700]">
                                    Qty: {item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm bg-white px-2.5 py-0.5 rounded-full font-medium text-gray-700 border border-[#FDD700]">
                                {item.offers.length}{" "}
                                {item.offers.length === 1 ? "offer" : "offers"}
                              </span>
                            </div>

                            {item.offers.length > 0 && (
                              <div className="mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                                      Lowest Offer
                                    </p>
                                    <p className="font-medium flex items-center">
                                      <FiDollarSign className="mr-2 text-emerald-600" />
                                      {Math.min(
                                        ...item.offers.map(
                                          (o) => o.pricePerUnit
                                        )
                                      ).toLocaleString(undefined, {
                                        style: "currency",
                                        currency: "USD",
                                      })}
                                      <span className="text-xs text-gray-500 ml-1">
                                        per unit
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                                      Average Offer
                                    </p>
                                    <p className="font-medium flex items-center">
                                      <FiDollarSign className="mr-2 text-emerald-600" />
                                      {(
                                        item.offers.reduce(
                                          (sum, offer) =>
                                            sum + offer.pricePerUnit,
                                          0
                                        ) / item.offers.length
                                      ).toLocaleString(undefined, {
                                        style: "currency",
                                        currency: "USD",
                                      })}
                                      <span className="text-xs text-gray-500 ml-1">
                                        per unit
                                      </span>
                                    </p>
                                  </div>
                                </div>
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
