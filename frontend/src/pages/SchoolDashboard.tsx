// src/pages/SchoolDashboard.tsx
import { Link, Outlet, useLocation } from "react-router-dom";

function navLinkClass(location: any, path: string) {
  return location.pathname === path
    ? "bg-blue-800 p-2 rounded"
    : "hover:bg-blue-600 p-2 rounded";
}

export default function SchoolDashboard() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-6">School Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/school-dashboard/available-bids"
            className={navLinkClass(
              location,
              "/school-dashboard/available-bids"
            )}
          >
            Available Bids
          </Link>
          <Link
            to="/school-dashboard/post-bid"
            className={navLinkClass(location, "/school-dashboard/post-bid")}
          >
            Post New Bid
          </Link>
          <Link
            to="/school-dashboard/my-bids"
            className={navLinkClass(location, "/school-dashboard/my-bids")}
          >
            My Active Bids
          </Link>
          <Link
            to="/school-dashboard/payment-status"
            className={navLinkClass(
              location,
              "/school-dashboard/payment-status"
            )}
          >
            Payment Status
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-blue-50">
        <Outlet />
      </main>
    </div>
  );
}
