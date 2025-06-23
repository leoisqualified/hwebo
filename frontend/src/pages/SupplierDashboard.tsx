import React from "react";

export default function SupplierDashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-700 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Supplier Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:bg-green-600 p-2 rounded">
            My Offers
          </a>
          <a href="#" className="hover:bg-green-600 p-2 rounded">
            Active Bids
          </a>
          <a href="#" className="hover:bg-green-600 p-2 rounded">
            Payment Status
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-green-50">
        <h1 className="text-2xl font-semibold mb-4">Welcome, Supplier!</h1>
        {/* Supplier content */}
      </main>
    </div>
  );
}
