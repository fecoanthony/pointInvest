// src/pages/admin/AdminOverview.jsx
import React, { useEffect, useState } from "react";
import { getAdminDashboardSummary } from "../../services/adminApi";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const formatMoney = (cents) =>
  `$${(cents / 100).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

export default function AdminOverview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboardSummary();
        setSummary(res.data.data);
      } catch (err) {
        console.error("Admin summary error:", err);
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading || !summary) {
    return <LoadingSpinner />;
  }

  const { users, investments, transactions, recent } = summary;

  // transactions: [{ _id: "deposit", total }, ...]
  const getTxTotal = (type) =>
    transactions?.find((t) => t._id === type)?.total || 0;

  const depositVolumeCents = getTxTotal("deposit");
  const withdrawVolumeCents = getTxTotal("withdraw");

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin Dashboard Overview
      </h1>

      {/* Users stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.total} />
        <StatCard label="Active Users" value={users.active} />
        <StatCard label="Suspended Users" value={users.suspended} />
        <StatCard label="Admins" value={users.admins} />
      </div>

      {/* Investments stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Investments" value={investments.total} />
        <StatCard label="Active Investments" value={investments.active} />
        <StatCard label="Paused Investments" value={investments.paused} />
        <StatCard label="Completed Investments" value={investments.completed} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Investment Volume"
          value={formatMoney(investments.volumeCents)}
        />
        <StatCard
          label="Deposit Volume"
          value={formatMoney(depositVolumeCents)}
        />
        <StatCard
          label="Withdrawal Volume"
          value={formatMoney(withdrawVolumeCents)}
        />
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Recent Transactions</h2>
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">User</th>
                <th className="text-left py-1">Type</th>
                <th className="text-left py-1">Amount</th>
                <th className="text-left py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="py-1">
                    {tx.userId?.name || "N/A"}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {tx.userId?.email}
                    </span>
                  </td>
                  <td className="py-1 capitalize">{tx.type}</td>
                  <td className="py-1">
                    {formatMoney(tx.amountCents, tx.currency || "USD")}
                  </td>
                  <td className="py-1 capitalize text-xs">{tx.status}</td>
                </tr>
              ))}
              {recent.transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-2 text-gray-500 text-center">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Investments */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Recent Investments</h2>
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">User</th>
                <th className="text-left py-1">Plan</th>
                <th className="text-left py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.investments.map((inv) => (
                <tr key={inv._id}>
                  <td className="py-1">
                    {inv.userId?.name || "N/A"}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {inv.userId?.email}
                    </span>
                  </td>
                  <td className="py-1">{inv.planId?.name || "N/A"}</td>
                  <td className="py-1">
                    {formatMoney(inv.amountCents, inv.currency || "USD")}
                  </td>
                </tr>
              ))}
              {recent.investments.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-gray-500 text-center">
                    No recent investments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Recent Users</h2>
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">Name</th>
                <th className="text-left py-1">Email</th>
                <th className="text-left py-1">Role</th>
              </tr>
            </thead>
            <tbody>
              {recent.users.map((u) => (
                <tr key={u._id}>
                  <td className="py-1">{u.name}</td>
                  <td className="py-1">{u.email}</td>
                  <td className="py-1">{u.role}</td>
                </tr>
              ))}
              {recent.users.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-gray-500 text-center">
                    No recent users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-lg md:text-xl font-bold">{value}</p>
    </div>
  );
}
