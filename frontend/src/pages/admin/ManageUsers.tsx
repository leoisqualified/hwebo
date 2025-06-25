import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  role: "admin" | "school" | "supplier";
  verified: boolean;
  createdAt: string;
  lastLogin?: string;
  kycVerified?: boolean;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesVerification = verificationFilter === "all" || 
      (verificationFilter === "verified" && user.verified) || 
      (verificationFilter === "unverified" && !user.verified);
    return matchesSearch && matchesRole && matchesVerification;
  });

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`, { verify: !currentStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, verified: !currentStatus } : user
      ));
    } catch (err: any) {
      console.error(err);
      alert("Failed to update user verification status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEE2E2] border border-[#DC2626] text-[#DC2626] p-4 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Manage Users</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="school">School</option>
            <option value="supplier">Supplier</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || roleFilter !== "all" || verificationFilter !== "all"
              ? "No users match your criteria." 
              : "There are currently no users."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F3F4F6]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${
                        user.role === 'admin' ? 'bg-[#EDE9FE] text-[#7C3AED]' :
                        user.role === 'school' ? 'bg-[#DBEAFE] text-[#1E40AF]' :
                        'bg-[#D1FAE5] text-[#059669]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.verified ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'
                      }`}>
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                      {user.role === 'supplier' && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                          user.kycVerified ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {user.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleVerification(user.id, user.verified)}
                        className={`mr-2 ${
                          user.verified ? 'text-[#DC2626] hover:text-[#B91C1C]' : 'text-[#059669] hover:text-[#047857]'
                        }`}
                      >
                        {user.verified ? 'Unverify' : 'Verify'}
                      </motion.button>
                      <button className="text-[#1E3A8A] hover:text-[#1E40AF]">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}