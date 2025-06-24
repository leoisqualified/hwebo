import { useEffect, useState } from "react";
import api from "../services/api";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export default function PaymentStatus() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/supplier/payments");
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Payment Status</h1>
      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="text-center">
                <td className="p-2 border">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">${payment.amount.toFixed(2)}</td>
                <td
                  className={`p-2 border font-semibold ${
                    payment.status === "approved"
                      ? "text-green-600"
                      : payment.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {payment.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
