import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";

interface Bid {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  school: string;
  budget: string;
  category: string;
}

export default function AvailableBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get("/supplier/available-bids");
        setBids(res.data);
      } catch (err) {
        setError("Failed to fetch bids. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const placeOffer = (bidId: string) => {
    // TODO: Implement actual offer placement logic
    alert(`Place offer for Bid ID: ${bidId}`);
  };

  const filteredBids = bids.filter(
    (bid) =>
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (filteredBids.length === 0) {
    return (
      <div className="text-center py-12">
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
          No bids available
        </h3>
        <p className="mt-1 text-gray-500">
          {searchTerm
            ? "No bids match your search."
            : "There are currently no open bids."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Available Bids</h1>
        <div className="relative w-64">
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBids.map((bid, index) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-[#1E3A8A]">
                    {bid.title}
                  </h2>
                  <p className="text-sm text-[#059669] font-medium mt-1">
                    {bid.school}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-gray-800">
                  {bid.category}
                </span>
              </div>

              <p className="mt-3 text-gray-600 line-clamp-3">
                {bid.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-medium">{bid.budget}</p>
                </div>
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
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => placeOffer(bid.id)}
                className="mt-6 w-full bg-[#059669] hover:bg-[#047857] text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                Place Offer
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
