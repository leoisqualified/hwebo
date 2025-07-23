// src/pages/Unauthorized.tsx

import { motion } from "framer-motion";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white   p-8 text-center"
      >
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-50 mb-4">
          <FiAlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Return to Previous Page
        </motion.button>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@example.com"
              className="text-red-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
