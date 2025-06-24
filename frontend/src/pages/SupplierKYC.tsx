import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SupplierKYC() {
  const { user, fetchUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
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
      fetchUser(); // Refresh user data to possibly update verification status
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "KYC upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          KYC Verification
        </h1>
        <p className="mb-4 text-gray-600 text-center">
          Upload your KYC document to proceed.
        </p>

        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="bg-green-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        {successMessage && (
          <p className="text-green-600 mt-4">{successMessage}</p>
        )}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
