// SupplierVerificationFailed.tsx

import { useNavigate } from "react-router-dom";

const SupplierVerificationFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen text-center py-8">
      <div>
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
          Your submitted documents have been received, but we couldn't verify
          your business against government records.
        </p>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Please ensure your registration number, tax ID, and other business
          details are accurate. You may be contacted to provide additional
          documentation.
        </p>

        <button
          onClick={() => navigate("/supplier/kyc")}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Resubmit Documents
        </button>
      </div>
    </div>
  );
};

export default SupplierVerificationFailed;
