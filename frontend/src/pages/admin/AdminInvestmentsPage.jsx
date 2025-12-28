// src/pages/admin/AdminInvestmentsPage.jsx
import React, { useEffect, useState } from "react";
import {
  adminListInvestments,
  adminToggleInvestmentState,
  adminForceCancelInvestment,
} from "../../services/adminApi";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const formatMoney = (cents) =>
  `$${(cents / 100).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, [page, limit, stateFilter]);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const res = await adminListInvestments({
        page,
        limit,
        ...(stateFilter ? { state: stateFilter } : {}),
      });
      const { investments, total } = res.data.data;
      setInvestments(investments || []);
      setTotal(total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  const toggleState = async (investmentId, currentState) => {
    try {
      const action = currentState === "paused" ? "resume" : "pause";
      await adminToggleInvestmentState(investmentId, action);
      toast.success(`Investment ${action}d`);
      loadInvestments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change investment state");
    }
  };

  const forceCancel = async (investmentId) => {
    if (!window.confirm("Force cancel this investment?")) return;
    try {
      await adminForceCancelInvestment(investmentId);
      toast.success("Investment force-cancelled");
      loadInvestments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to force cancel investment");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">Investments</h1>

      <div className="flex items-center gap-2 text-sm">
        <label className="text-gray-600">State:</label>
        <select
          value={stateFilter}
          onChange={(e) => {
            setPage(1);
            setStateFilter(e.target.value);
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Plan</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">State</th>
            <th className="text-left p-2">Created</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv._id}>
              <td className="p-2">
                {inv.userId?.name}
                <br />
                <span className="text-xs text-gray-500">
                  {inv.userId?.email}
                </span>
              </td>
              <td className="p-2">{inv.planId?.name}</td>
              <td className="p-2">{formatMoney(inv.amountCents)}</td>
              <td className="p-2 capitalize">{inv.state}</td>
              <td className="p-2">
                {new Date(inv.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 space-x-2">
                {inv.state !== "completed" && (
                  <button
                    onClick={() => toggleState(inv._id, inv.state)}
                    className="px-2 py-1 text-xs rounded bg-gray-200"
                  >
                    {inv.state === "paused" ? "Resume" : "Pause"}
                  </button>
                )}
                {inv.state !== "completed" && (
                  <button
                    onClick={() => forceCancel(inv._id)}
                    className="px-2 py-1 text-xs rounded bg-red-200"
                  >
                    Force Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
          {investments.length === 0 && (
            <tr>
              <td colSpan={6} className="p-2 text-gray-500">
                No investments found
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
    </div>
  );
}
