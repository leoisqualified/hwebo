import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { motion } from "framer-motion";

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
      };
    };
  };
}

const statusColors = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  accepted: "bg-[#D1FAE5] text-[#059669]",
  completed: "bg-[#DBEAFE] text-[#1E40AF]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function MyAwards() {
  const [awards, setAwards] = useState<AwardedOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwardedOffers = async () => {
      try {
        const res = await api.get("/supplier/my-awarded-offers");
        setAwards(res.data.awardedOffers);
      } catch (err) {
        console.error("Failed to fetch awarded offers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwardedOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center max-w-2xl mx-auto">
        <div className="text-[#FBBF24] text-5xl mb-4">
          <FiAward className="inline-block" />
        </div>
        <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
          No awards yet
        </h3>
        <p className="text-[#1E3A8A]">
          You haven't been awarded any bids yet. Keep submitting offers!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1E3A8A]">My Awarded Bids</h2>
      </div>

      <div className="space-y-4">
        {awards.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-[#FBBF24]" />
                    <h3 className="text-lg font-semibold text-[#1E3A8A]">
                      {offer.bidItem.itemName}
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {offer.bidItem.bidRequest.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaSchool className="text-[#059669]" />
                    <span>{offer.bidItem.bidRequest.school.name}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      statusColors[offer.status]
                    }`}
                  >
                    {offer.status.charAt(0).toUpperCase() +
                      offer.status.slice(1)}
                  </span>
                  <div className="mt-2 text-right">
                    <p className="text-lg font-bold text-[#1E3A8A]">
                      KES {offer.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {offer.bidItem.quantity} {offer.bidItem.unit} × KES{" "}
                      {offer.pricePerUnit}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FiClock className="text-[#059669]" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery Time</p>
                    <p className="font-medium">{offer.deliveryTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-[#059669]" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{offer.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiTruck className="text-[#059669]" />
                  <div>
                    <p className="text-sm text-gray-500">Actions</p>
                    <div className="flex gap-2">
                      <button className="text-sm text-[#059669] hover:text-[#047857]">
                        Update Status
                      </button>
                      <button className="text-sm text-[#1E3A8A] hover:text-[#1E3A8A]/80">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {offer.notes && (
                <div className="mt-4 p-3 bg-[#F3F4F6] rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Notes:</span> {offer.notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
