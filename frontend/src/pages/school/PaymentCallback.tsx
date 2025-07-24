// src/pages/PaymentCallback.tsx (or wherever you keep your pages)
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import api from "../../services/api";

const PaymentCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const ref = params.get("ref") || params.get("reference");
        const txRef = params.get("tx_ref");

        if (!ref && !txRef) {
          throw new Error("No payment reference found");
        }

        // Send to backend to verify payment status
        const response = await api.post("/payment/verify", {
          reference: ref || txRef,
        });

        if (response.data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          // Optionally store payment status in state/context
        } else {
          setStatus("failed");
          setMessage(response.data.message || "Payment verification failed");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Error verifying payment. Please contact support.");
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, [params]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="h-12 w-12 text-green-500" />;
      case "failed":
        return <FiAlertCircle className="h-12 w-12 text-red-500" />;
      default:
        return <FiLoader className="h-12 w-12 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200"
      >
        <div className="flex justify-center mb-6">{getStatusIcon()}</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {status === "success"
            ? "Payment Successful"
            : status === "failed"
            ? "Payment Failed"
            : "Processing Payment"}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {status !== "pending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button
              onClick={() =>
                navigate("/school-dashboard/payment-status", {
                  state: { paymentUpdated: true },
                })
              }
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            {status === "failed" && (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@yourdomain.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
