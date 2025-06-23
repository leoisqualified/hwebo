import React from "react";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:bg-gray-700 p-2 rounded">
            Verify Suppliers
          </a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">
            View Bids
          </a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">
            Manage Users
          </a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">
            Reports
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Welcome, Admin!</h1>
        {/* Put your admin dashboard components here */}
      </main>
    </div>
  );
}
