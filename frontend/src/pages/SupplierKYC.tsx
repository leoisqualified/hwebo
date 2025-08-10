import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const SupplierKYC = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    registrationNumber: "",
    taxId: "",
    contactPerson: "",
    phoneNumber: "",
    momoNumber: "",
    bankAccount: "",
  });

  const [files, setFiles] = useState({
    fdaLicense: null as File | null,
    registrationCertificate: null as File | null,
    ownerId: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.verified) {
      navigate("/supplier/dashboard");
    } else if (
      user.supplierProfile &&
      user.supplierProfile.verificationStatus === "failed"
    ) {
      // Do nothing — they're allowed to resubmit
    } else if (user.supplierProfile) {
      // If already submitted and not failed, redirect to dashboard
      navigate("/supplier/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof files
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    const { fdaLicense, registrationCertificate, ownerId } = files;

    if (!fdaLicense || !registrationCertificate || !ownerId) {
      setNotification({
        message: "Please upload all required documents.",
        type: "error",
      });
      return;
    }

    const payload = new FormData();
    payload.append("fdaLicense", fdaLicense);
    payload.append("registrationCertificate", registrationCertificate);
    payload.append("ownerId", ownerId);

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    try {
      setLoading(true);
      setNotification(null);

      await api.post("/supplier/kyc", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification({
        message: "KYC submitted successfully!",
        type: "success",
      });
      await fetchUser();

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setNotification({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#059669]">
            Business Verification (KYC)
          </h2>
          <p className="text-gray-500 mt-2">
            Complete your business verification to start receiving bids
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["Business Name", "businessName", "text"],
            ["Registration Number", "registrationNumber", "text"],
            ["Tax ID", "taxId", "text"],
            ["Contact Person", "contactPerson", "text"],
            ["Phone Number", "phoneNumber", "tel"],
            ["Mobile Money Number", "momoNumber", "tel"],
            ["Bank Account", "bankAccount", "text"],
          ].map(([label, name, type]) => (
            <div key={name as string} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {label as string}
              </label>
              <input
                type={type as string}
                name={name as string}
                value={(formData as any)[name as string]}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          <h3 className="text-lg font-medium text-[#059669]">
            Required Documents
          </h3>

          {[
            ["FDA License", "fdaLicense", "Upload FDA license document"],
            [
              "Registration Certificate",
              "registrationCertificate",
              "Upload business registration certificate",
            ],
            ["Owner ID", "ownerId", "Upload government-issued ID"],
          ].map(([label, name, placeholder]) => (
            <div key={name as string} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label as string}
              </label>
              <div className="flex items-center">
                <label className="flex flex-1 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, name as keyof typeof files)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:border-[#059669] transition-colors">
                        <FiUpload className="text-[#059669] mr-2" />
                        <span className="truncate">
                          {files[name as keyof typeof files]?.name ||
                            placeholder}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
                {files[name as keyof typeof files] && (
                  <button
                    onClick={() =>
                      setFiles({ ...files, [name as keyof typeof files]: null })
                    }
                    className="ml-2 text-gray-400 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#059669] hover:bg-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669] transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit KYC"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between ${
            notification.type === "success"
              ? "bg-[#D1FAE5] text-[#059669]"
              : "bg-[#FEE2E2] text-[#DC2626]"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <FiCheckCircle className="mr-2" />
            ) : (
              <FiAlertCircle className="mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-current hover:text-opacity-70"
          >
            <FiX />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SupplierKYC;
