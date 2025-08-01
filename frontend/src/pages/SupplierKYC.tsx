import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const hasSubmittedKyc = kycSubmitted || user?.kycStatus === "submitted";

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.verified) {
      navigate("/supplier/dashboard");
    }
  }, [user?.verified, navigate]);

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

      setSuccessMessage("KYC documents have been uploaded successfully.");
      setKycSubmitted(true);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md overflow-hidden"
      >
        {/* Header with subtle border */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            KYC Verification
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.verified
              ? "Your KYC verification is complete."
              : "Upload your documents to complete verification."}
          </p>
        </div>

        <div className="p-6">
          {user?.verified ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Verified Successfully
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Your account is fully verified.
              </p>
            </div>
          ) : kycSubmitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mb-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Business Verification Failed
              </h3>
              <p className="text-gray-600 text-sm mt-1 max-w-md mx-auto">
                Your submitted documents have been received, but we couldn’t
                verify your business against government records.
              </p>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                Please ensure your registration number, tax ID, and other
                business details are accurate. You may be contacted to provide
                additional documentation.
              </p>
            </div>
          ) : (
            <>
              {/* Text Inputs */}
              <div className="space-y-3">
                {hasSubmittedKyc && (
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md mb-4 border border-blue-300">
                    You have already submitted your KYC documents. We are
                    currently reviewing them.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tax identification number"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name of contact person"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile money number"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account
                  </label>
                  <input
                    type="text"
                    placeholder="Enter bank account details"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* File Inputs */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Required Documents *
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* FDA License */}
                  <div className="border border-dashed border-gray-300 rounded-md p-3">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <h3 className="text-xs font-medium text-gray-700">
                        FDA License
                      </h3>
                      <label className="cursor-pointer">
                        <span className="px-2 py-1 bg-gray-50 text-indigo-600 rounded-md font-medium hover:bg-gray-100 transition-colors text-xs">
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
                        <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-md w-full">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-[10px] text-gray-700 truncate">
                            {fdaLicenseFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Registration Certificate */}
                  <div className="border border-dashed border-gray-300 rounded-md p-3">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <h3 className="text-xs font-medium text-gray-700">
                        Registration Certificate
                      </h3>
                      <label className="cursor-pointer">
                        <span className="px-2 py-1 bg-gray-50 text-indigo-600 rounded-md font-medium hover:bg-gray-100 transition-colors text-xs">
                          Select
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(e, setRegistrationCertificateFile)
                          }
                          className="hidden"
                        />
                      </label>
                      {registrationCertificateFile && (
                        <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-md w-full">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
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

                  {/* Owner ID */}
                  <div className="border border-dashed border-gray-300 rounded-md p-3">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <h3 className="text-xs font-medium text-gray-700">
                        Owner ID
                      </h3>
                      <label className="cursor-pointer">
                        <span className="px-2 py-1 bg-gray-50 text-indigo-600 rounded-md font-medium hover:bg-gray-100 transition-colors text-xs">
                          Select
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, setOwnerIdFile)}
                          className="hidden"
                        />
                      </label>
                      {ownerIdFile && (
                        <div className="mt-1 flex items-center space-x-1 bg-gray-50 p-1 rounded-md w-full">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
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

                <div className="text-xs text-gray-500 mt-3">
                  <p>Accepted documents:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Government-issued ID</li>
                    <li>Business registration documents</li>
                    <li>Tax identification documents</li>
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleUpload}
                disabled={
                  uploading ||
                  !fdaLicenseFile ||
                  !registrationCertificateFile ||
                  !ownerIdFile ||
                  !businessName ||
                  !registrationNumber ||
                  !taxId ||
                  !contactPerson ||
                  !phoneNumber
                }
                className={`mt-6 w-full py-2.5 rounded-md font-medium transition-colors text-sm ${
                  uploading ||
                  !fdaLicenseFile ||
                  !registrationCertificateFile ||
                  !ownerIdFile ||
                  !businessName ||
                  !registrationNumber ||
                  !taxId ||
                  !contactPerson ||
                  !phoneNumber
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#059669] text-white hover:bg-[#047857] hover:cursor-pointer"
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
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
