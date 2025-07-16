import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const currentTab = location.pathname.includes("my-offers")
    ? "My Offers"
    : location.pathname.includes("my-awards")
    ? "My Awards"
    : "Available Bids";

  const navLinkClass = (isActive: boolean) =>
    `flex items-center space-x-3 p-2.5 rounded-lg transition-colors text-sm ${
      isActive
        ? "bg-indigo-100 text-[#059669] font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col"
      >
        <div className="flex items-center space-x-3 mb-8 pt-2">
          <div className="h-9 w-9 rounded-full bg-[#059669] flex items-center justify-center text-white font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Supplier Panel
            </h2>
            <p className="text-gray-500 text-xs">Welcome back!</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <motion.div whileHover={{ x: 3 }}>
            <NavLink
              to="/supplier/dashboard/available-bids"
              className={({ isActive }) => navLinkClass(isActive)}
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
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Available Bids</span>
            </NavLink>
          </motion.div>

          {/* <motion.div whileHover={{ x: 3 }}>
            <NavLink
              to="/supplier/dashboard/my-offers"
              className={({ isActive }) => navLinkClass(isActive)}
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
                  strokeWidth="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>My Offers</span>
            </NavLink>
          </motion.div> */}

          <motion.div whileHover={{ x: 3 }}>
            <NavLink
              to="/supplier/dashboard/my-awards"
              className={({ isActive }) => navLinkClass(isActive)}
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
                  strokeWidth="1.5"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>My Awards</span>
            </NavLink>
          </motion.div>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2.5 rounded-lg text-gray-600 hover:bg-red-300 w-full text-left text-sm"
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
                strokeWidth="1.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-[#059669]">
              {currentTab}
            </h1>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-[#059669] flex items-center justify-center text-white font-medium">
                  S
                </div>
                <span className="text-sm font-medium">Supplier</span>
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
