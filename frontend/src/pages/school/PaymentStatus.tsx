// src/pages/school/PaymentStatus.tsx
import { useEffect, useState } from "react";
import api from "../../services/api"; // Ensure this is your axios setup
import { useAuth } from "../../context/AuthContext";

export default function PaymentStatus() {
  const [payments, setPayments] = useState<any[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/supplier/school-payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data.awardedOffers);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };

    fetchPayments();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Payment Status</h1>
      {payments.length === 0 ? (
        <p>No awarded offers yet.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((offer) => (
            <div key={offer.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">
                {offer.bidItem.itemName}
              </h2>
              <p>Supplier: {offer.supplier.email}</p>
              <p>Price per unit: {offer.pricePerUnit}</p>
              <p>Status: {offer.paymentStatus || "Pending"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
