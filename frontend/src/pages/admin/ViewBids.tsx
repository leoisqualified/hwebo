import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ViewBids() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get("/admin/bids");
        setBids(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) return <div className="p-8">Loading bids...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">All Bids</h1>
      {bids.length === 0 ? (
        <p>No bids available.</p>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-2">Bid: {bid.title}</h2>
              <p className="mb-2 text-gray-600">School: {bid.school?.email}</p>
              <p className="mb-4 text-gray-500">
                Deadline: {new Date(bid.deadline).toLocaleDateString()}
              </p>

              <h3 className="font-semibold mb-2">Bid Items:</h3>
              <ul className="list-disc pl-5 mb-4">
                {bid.items.map((item: any) => (
                  <li key={item.id} className="mb-2">
                    <p className="font-medium">{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Offers: {item.offers.length}</p>
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
