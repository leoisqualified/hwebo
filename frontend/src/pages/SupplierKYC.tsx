import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function SupplierKYC() {
  const { user, fetchUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await api.post("/supplier/kyc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(
        "KYC document uploaded successfully. Awaiting verification."
      );
      setFileName("");
      setSelectedFile(null);
      fetchUser(); // Refresh user data to possibly update verification status
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "KYC upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm w-full max-w-md overflow-hidden"
      >
        {/* Header with gradient accent */}
        <div className="h-2 bg-gradient-to-r from-[#059669] to-[#FBBF24]"></div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1E3A8A]">
              KYC Verification
            </h1>
            <p className="text-gray-500 mt-2">
              {user?.verified
                ? "Your KYC verification is complete."
                : "Upload your documents to complete verification."}
            </p>
          </div>

          {user?.verified ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D1FAE5] rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-[#059669]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Verified Successfully
              </h3>
              <p className="text-gray-500 mt-1">
                Your account is fully verified.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your KYC documents (PDF, JPG, PNG)
                    </p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-[#F3F4F6] text-[#1E3A8A] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors">
                        Select File
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  {fileName && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      <svg
                        className="w-5 h-5 text-[#059669]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {fileName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <p>Accepted documents:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Government-issued ID</li>
                    <li>Business registration documents</li>
                    <li>Tax identification documents</li>
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className={`mt-6 w-full py-3 rounded-xl font-medium transition-colors ${
                  uploading || !selectedFile
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#059669] text-white hover:bg-[#047857]"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
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
                    Uploading...
                  </span>
                ) : (
                  "Submit Verification"
                )}
              </motion.button>
            </>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-[#D1FAE5] text-[#059669] rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-3 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
