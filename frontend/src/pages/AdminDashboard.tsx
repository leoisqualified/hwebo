import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // Clear authentication (depends on your auth setup)
    localStorage.removeItem("token"); // Example: clearing token

    // Optionally, you can clear user context/state here

    // Redirect to login
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-[#1E3A8A] text-white p-5 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-8 pt-4">
          <div className="h-10 w-10 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-[#9CA3AF] text-sm">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-col space-y-2">
          <Link
            to="verify-suppliers"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname.includes("verify-suppliers")
                ? "bg-[#059669]"
                : "hover:bg-[#1E40AF]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Verify Suppliers</span>
          </Link>

          <Link
            to="view-bids"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname.includes("view-bids")
                ? "bg-[#059669]"
                : "hover:bg-[#1E40AF]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>View Bids</span>
          </Link>

          <Link
            to="manage-users"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname.includes("manage-users")
                ? "bg-[#059669]"
                : "hover:bg-[#1E40AF]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Manage Users</span>
          </Link>

          <Link
            to="reports"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname.includes("reports")
                ? "bg-[#059669]"
                : "hover:bg-[#1E40AF]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Reports</span>
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1E40AF] w-full text-left"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
