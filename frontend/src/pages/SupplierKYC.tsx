import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function SupplierKYC() {
  const { user, fetchUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fdaLicenseFile, setFdaLicenseFile] = useState<File | null>(null);
  const [registrationCertificateFile, setRegistrationCertificateFile] =
    useState<File | null>(null);
  const [ownerIdFile, setOwnerIdFile] = useState<File | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fdaLicenseFile || !registrationCertificateFile || !ownerIdFile) {
      setErrorMessage("Please select all required documents.");
      return;
    }

    const formData = new FormData();
    formData.append("fdaLicense", fdaLicenseFile);
    formData.append("registrationCertificate", registrationCertificateFile);
    formData.append("ownerId", ownerIdFile);
    // Append the form text fields
    formData.append("businessName", businessName);
    formData.append("registrationNumber", registrationNumber);
    formData.append("taxId", taxId);
    formData.append("contactPerson", contactPerson);
    formData.append("phoneNumber", phoneNumber);
    formData.append("momoNumber", momoNumber);
    formData.append("bankAccount", bankAccount);

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await api.post("/supplier/kyc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(
        "KYC documents uploaded successfully. Awaiting verification."
      );
      setFdaLicenseFile(null);
      setRegistrationCertificateFile(null);
      setOwnerIdFile(null);
      fetchUser();
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
              {/* Text Inputs */}
              <div className="space-y-4">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                    required
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                    required
                  />
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tax identification number"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                    required
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name of contact person"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                    required
                  />
                </div>

                {/* Mobile Money Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile money number"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                  />
                </div>

                {/* Bank Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account
                  </label>
                  <input
                    type="text"
                    placeholder="Enter bank account details"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
                  />
                </div>
              </div>
              {/* File Inputs */}
              <div className="space-y-4">
                <div className="p-4">
                  <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2">
                    {" "}
                    {/* Changed to flex-nowrap with horizontal scroll */}
                    {/* FDA License - Updated smaller card */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex-shrink-0 w-[180px]">
                      {" "}
                      {/* Fixed width and reduced padding */}
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-1">
                        {" "}
                        {/* Reduced spacing */}
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                        <h3 className="text-xs font-medium text-gray-700">
                          FDA License
                        </h3>{" "}
                        {/* Smaller text */}
                        <p className="text-[10px] text-gray-500">
                          (PDF, JPG, PNG)
                        </p>{" "}
                        {/* Smaller text */}
                        <label className="cursor-pointer mt-1">
                          {" "}
                          {/* Reduced margin */}
                          <span className="px-2 py-1 bg-[#F3F4F6] text-[#1E3A8A] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors text-xs">
                            Select
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileChange(e, setFdaLicenseFile)
                            }
                            className="hidden"
                          />
                        </label>
                        {fdaLicenseFile && (
                          <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-lg w-full">
                            {" "}
                            {/* Smaller spacing */}
                            <svg
                              className="w-3 h-3 text-[#059669]"
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
                            <span className="text-[10px] text-gray-700 truncate">
                              {fdaLicenseFile.name}
                            </span>{" "}
                            {/* Smaller text */}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Registration Certificate - Same updates */}
                    {/* Registration Certificate Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex-shrink-0 w-[180px]">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-1">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                        <h3 className="text-xs font-medium text-gray-700">
                          Registration Certificate
                        </h3>
                        <p className="text-[10px] text-gray-500">
                          (PDF, JPG, PNG)
                        </p>
                        <label className="cursor-pointer mt-1">
                          <span className="px-2 py-1 bg-[#F3F4F6] text-[#1E3A8A] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors text-xs">
                            Select
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                setRegistrationCertificateFile
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        {registrationCertificateFile && (
                          <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-lg w-full">
                            <svg
                              className="w-3 h-3 text-[#059669]"
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
                            <span className="text-[10px] text-gray-700 truncate">
                              {registrationCertificateFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Owner ID - Same updates */}
                    {/* Owner ID Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex-shrink-0 w-[180px]">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-1">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                        <h3 className="text-xs font-medium text-gray-700">
                          Owner ID
                        </h3>
                        <p className="text-[10px] text-gray-500">
                          (PDF, JPG, PNG)
                        </p>
                        <label className="cursor-pointer mt-1">
                          <span className="px-2 py-1 bg-[#F3F4F6] text-[#1E3A8A] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors text-xs">
                            Select
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileChange(e, setOwnerIdFile)
                            }
                            className="hidden"
                          />
                        </label>
                        {ownerIdFile && (
                          <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-lg w-full">
                            <svg
                              className="w-3 h-3 text-[#059669]"
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
                            <span className="text-[10px] text-gray-700 truncate">
                              {ownerIdFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                disabled={
                  uploading ||
                  !fdaLicenseFile ||
                  !registrationCertificateFile ||
                  !ownerIdFile
                }
                className={`mt-6 w-full py-3 rounded-xl font-medium transition-colors ${
                  uploading ||
                  !fdaLicenseFile ||
                  !registrationCertificateFile ||
                  !ownerIdFile ||
                  !businessName ||
                  !registrationNumber ||
                  !taxId ||
                  !contactPerson ||
                  !phoneNumber ||
                  !momoNumber ||
                  !bankAccount
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
