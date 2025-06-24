import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="verify-suppliers" className="hover:bg-gray-700 p-2 rounded">
            Verify Suppliers
          </Link>
          <Link to="view-bids" className="hover:bg-gray-700 p-2 rounded">
            View Bids
          </Link>
          <Link to="manage-users" className="hover:bg-gray-700 p-2 rounded">
            Manage Users
          </Link>
          <Link to="reports" className="hover:bg-gray-700 p-2 rounded">
            Reports
          </Link>
        </nav>
      </aside>

      {/* Dynamic content area */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
