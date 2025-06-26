import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SupplierDashboard() {
  const location = useLocation();

  // Extract current tab name from URL path
  const currentTab = location.pathname.includes("my-offers")
    ? "My Offers"
    : "Available Bids";

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
            S
          </div>
          <div>
            <h2 className="text-xl font-bold">Supplier Panel</h2>
            <p className="text-[#9CA3AF] text-sm">Welcome back!</p>
          </div>
        </div>

        <nav className="flex flex-col space-y-2">
          <motion.div whileHover={{ x: 5 }}>
            <NavLink
              to="/supplier-dashboard/available-bids"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#059669]" : "hover:bg-[#1E40AF]"
                }`
              }
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
              <span>Available Bids</span>
            </NavLink>
          </motion.div>

          <motion.div whileHover={{ x: 5 }}>
            <NavLink
              to="/supplier-dashboard/my-offers"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#059669]" : "hover:bg-[#1E40AF]"
                }`
              }
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
              <span>My Offers</span>
            </NavLink>
          </motion.div>

          {/* Future: Payment Status */}
          {/* <motion.div whileHover={{ x: 5 }}>
            <NavLink
              to="/supplier-dashboard/payment-status"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#059669]" : "hover:bg-[#1E40AF]"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Payment Status</span>
            </NavLink>
          </motion.div> */}

          <div className="mt-auto pt-8">
            <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1E40AF] w-full text-left">
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
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1E3A8A]">{currentTab}</h1>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                />
              </div>

              <button className="p-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB]">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="font-medium">Supplier</span>
              </div>
            </div>
          </div>

          {/* This will render the active tab */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
