import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiFileText,
  FiUsers,
  FiPieChart,
  FiLogOut,
} from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    {
      path: "verify-suppliers",
      name: "Verify Suppliers",
      icon: <FiCheckCircle className="w-5 h-5" />,
      active: location.pathname.includes("verify-suppliers"),
    },
    {
      path: "view-bids",
      name: "View Bids",
      icon: <FiFileText className="w-5 h-5" />,
      active: location.pathname.includes("view-bids"),
    },
    {
      path: "manage-users",
      name: "Manage Users",
      icon: <FiUsers className="w-5 h-5" />,
      active: location.pathname.includes("manage-users"),
    },
    {
      path: "reports",
      name: "Reports",
      icon: <FiPieChart className="w-5 h-5" />,
      active: location.pathname.includes("reports"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-indigo-800 text-white p-6 shadow-xl flex flex-col"
      >
        {/* Branding */}
        <div className="flex items-center space-x-3 mb-10 pt-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
            <span className="text-xl">A</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Portal</h2>
            <p className="text-indigo-200 text-sm">Welcome Back!</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-emerald-500 shadow-md"
                    : "hover:bg-indigo-700 hover:shadow-sm"
                }`}
              >
                <div
                  className={`${
                    item.active ? "text-white" : "text-indigo-300"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
                {item.active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="h-1 w-1 bg-white rounded-full ml-auto"
                    initial={false}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-indigo-700">
          <motion.button
            whileHover={{ x: 3 }}
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700 w-full text-left text-indigo-100"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-3rem)] overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
