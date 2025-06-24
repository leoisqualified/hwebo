// src/pages/school/MyBids.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MyBids() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Active Bids</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bids.length === 0 ? (
        <p>You have no active bids.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-bold">{bid.title}</h2>
              <p className="text-gray-600 mb-2">{bid.description}</p>
              <p className="text-sm mb-2">
                Deadline:{" "}
                <strong>{new Date(bid.deadline).toLocaleDateString()}</strong>
              </p>

              <h3 className="font-medium">Items:</h3>
              <ul className="list-disc list-inside mb-2">
                {bid.items.map((item: any, index: number) => (
                  <li key={index}>
                    {item.itemName} - {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
