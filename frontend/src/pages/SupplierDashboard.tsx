import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("availableBids");

  if (user && !user.verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
            Pending Verification
          </h2>
          <p className="mb-4">
            Your account is currently under review. You will be able to access
            the dashboard once verified by an admin.
          </p>
          <p>Please check back later or contact support for updates.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "availableBids":
        return <div>List of available bids to offer on.</div>;
      case "myOffers":
        return <div>List of my submitted offers.</div>;
      case "activeBids":
        return <div>List of active bids I am participating in.</div>;
      case "paymentStatus":
        return <div>Payment status for awarded offers.</div>;
      default:
        return <div>Welcome, Supplier!</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-700 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Supplier Panel</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setSelectedTab("availableBids")}
            className="hover:bg-green-600 p-2 rounded text-left"
          >
            Available Bids
          </button>
          <button
            onClick={() => setSelectedTab("myOffers")}
            className="hover:bg-green-600 p-2 rounded text-left"
          >
            My Offers
          </button>
          <button
            onClick={() => setSelectedTab("activeBids")}
            className="hover:bg-green-600 p-2 rounded text-left"
          >
            Active Bids
          </button>
          <button
            onClick={() => setSelectedTab("paymentStatus")}
            className="hover:bg-green-600 p-2 rounded text-left"
          >
            Payment Status
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-green-50">
        <h1 className="text-2xl font-semibold mb-4">Supplier Dashboard</h1>
        <div className="bg-white p-6 rounded shadow">{renderContent()}</div>
      </main>
    </div>
  );
}
