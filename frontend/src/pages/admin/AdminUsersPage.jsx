// src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import {
  adminListUsers,
  adminToggleUserSuspension,
  adminChangeUserRole,
  adminGetUserDetails,
} from "../../services/adminApi";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, limit]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminListUsers({ page, limit });
      const { users, total } = res.data.data;
      setUsers(users || []);
      setTotal(total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspension = async (userId) => {
    try {
      await adminToggleUserSuspension(userId);
      toast.success("User status updated");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const changeRole = async (userId, role) => {
    try {
      await adminChangeUserRole(userId, role);
      toast.success("User role updated");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    }
  };

  const openDetails = async (userId) => {
    try {
      const res = await adminGetUserDetails(userId);
      setSelectedUser(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details");
    }
  };

  const closeDetails = () => setSelectedUser(null);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">Users Management</h1>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Suspended</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u._id, e.target.value)}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="super_admin">super_admin</option>
                </select>
              </td>
              <td className="p-2">{u.isSuspended ? "Yes" : "No"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => toggleSuspension(u._id)}
                  className="px-2 py-1 text-xs rounded bg-gray-200"
                >
                  {u.isSuspended ? "Unsuspend" : "Suspend"}
                </button>
                <button
                  onClick={() => openDetails(u._id)}
                  className="px-2 py-1 text-xs rounded bg-blue-200"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="p-2 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {total > limit && (
        <div className="flex justify-between text-xs text-gray-500 pt-2">
          <span>
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserDetailModal details={selectedUser} onClose={closeDetails} />
      )}
    </div>
  );
}

function UserDetailModal({ details, onClose }) {
  const { user, wallet, investmentsCount, recentTransactions } = details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-5 max-h-[90vh] overflow-y-auto text-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            Close
          </button>
        </div>

        <p className="font-semibold mb-1">{user.name}</p>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <p className="text-gray-600 mb-2">Role: {user.role}</p>
        <p className="text-gray-600 mb-2">
          Suspended: {user.isSuspended ? "Yes" : "No"}
        </p>
        <p className="text-gray-600 mb-2">
          KYC Status: {user.kycStatus || "none"}
        </p>

        <hr className="my-3" />

        <p className="font-semibold mb-1">Wallet</p>
        {wallet ? (
          <>
            <p>Main: {(wallet.mainBalanceCents / 100).toFixed(2)} USD</p>
            <p>Reserved: {(wallet.reservedCents / 100).toFixed(2)} USD</p>
          </>
        ) : (
          <p>No wallet</p>
        )}

        <hr className="my-3" />

        <p className="font-semibold mb-1">
          Investments count: {investmentsCount}
        </p>

        <hr className="my-3" />

        <p className="font-semibold mb-1">Recent Transactions</p>
        <ul className="space-y-1 max-h-40 overflow-y-auto">
          {recentTransactions.map((tx) => (
            <li key={tx._id} className="text-xs text-gray-700">
              {new Date(tx.createdAt).toLocaleString()} — {tx.type} —{" "}
              {(tx.amountCents / 100).toFixed(2)} {tx.currency || "USD"} —{" "}
              {tx.status}
            </li>
          ))}
          {recentTransactions.length === 0 && (
            <li className="text-xs text-gray-500">No transactions</li>
          )}
        </ul>
      </div>
    </div>
  );
}
