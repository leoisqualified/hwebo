import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Role</th>
              <th className="py-3 px-4 border-b">Verified</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b capitalize">{user.role}</td>
                <td className="py-3 px-4 border-b">
                  {user.verified ? (
                    <span className="text-green-600 font-semibold">
                      Verified
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  {/* Placeholder for future delete or manage actions */}
                  <button className="text-blue-600 hover:underline">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
