import { useEffect, useState } from "react";
import api from "../services/api";

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
      fetchAvailableBids(); // Optional: Refresh the list
    } catch (error: any) {
      console.error("Error submitting offer", error);
      alert(error.response?.data?.error || "Error submitting offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Bids</h2>
      {bids.length === 0 ? (
        <p>No available bids at the moment.</p>
      ) : (
        bids.map((bid) => (
          <div
            key={bid.bidRequestId}
            className="mb-8 p-4 border rounded shadow"
          >
            <h3 className="text-xl font-semibold">{bid.title}</h3>
            <p className="text-gray-600">{bid.description}</p>
            <p className="text-sm text-gray-500">
              Deadline: {new Date(bid.deadline).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">School: {bid.school}</p>

            {bid.items.map((item) => (
              <div key={item.id} className="mt-4 p-4 border rounded bg-gray-50">
                <h4 className="font-semibold">{item.itemName}</h4>
                <p>
                  Quantity: {item.quantity} {item.unit}
                </p>
                <p>Category: {item.category}</p>

                <input
                  type="number"
                  placeholder="Price per Unit"
                  className="mt-2 p-2 border rounded w-full"
                  value={offers[item.id]?.pricePerUnit || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "pricePerUnit", e.target.value)
                  }
                />
                <textarea
                  placeholder="Notes (optional)"
                  className="mt-2 p-2 border rounded w-full"
                  value={offers[item.id]?.notes || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "notes", e.target.value)
                  }
                />
                <button
                  onClick={() => submitOffer(item.id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Offer"}
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default SupplierAvailableBids;
