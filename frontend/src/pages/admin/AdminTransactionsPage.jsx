// src/pages/admin/AdminTransactionsPage.jsx
import React, { useEffect, useState } from "react";
import {
  adminListTransactions,
  adminProcessWithdrawal,
  adminCreateDeposit,
  adminGetPendingCryptoDeposits,
  adminApproveCryptoDeposit,
} from "../../services/adminApi";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const formatMoney = (cents) =>
  `$${(cents / 100).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [manualDeposit, setManualDeposit] = useState({
    userId: "",
    amount: "",
  });

  const [pendingCrypto, setPendingCrypto] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, [page, limit, typeFilter, statusFilter]);

  useEffect(() => {
    loadPendingCrypto();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await adminListTransactions({
        page,
        limit,
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const { txs, total } = res.data.data;
      setTxs(txs || []);
      setTotal(total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCrypto = async () => {
    try {
      const res = await adminGetPendingCryptoDeposits();
      setPendingCrypto(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdrawalAction = async (txId, action) => {
    try {
      await adminProcessWithdrawal({ transactionId: txId, action });
      toast.success(`Withdrawal ${action}`);
      loadTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to process withdrawal");
    }
  };

  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    const { userId, amount } = manualDeposit;
    if (!userId || !amount) {
      toast.error("User ID and amount are required");
      return;
    }
    try {
      await adminCreateDeposit({
        userId,
        amountCents: Math.round(Number(amount) * 100),
      });
      toast.success("Deposit applied");
      setManualDeposit({ userId: "", amount: "" });
      loadTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create deposit");
    }
  };

  const approveCrypto = async (txId) => {
    try {
      await adminApproveCryptoDeposit(txId);
      toast.success("Crypto deposit approved");
      loadPendingCrypto();
      loadTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve deposit");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Transactions</h1>

      {/* Filters & Manual deposit form */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <label>Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="payout">Payout</option>
            <option value="referral">Referral</option>
            <option value="fee">Fee</option>
            <option value="adjustment">Adjustment</option>
          </select>

          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <form
          onSubmit={handleCreateDeposit}
          className="bg-white rounded-xl shadow p-3 flex flex-col gap-2"
        >
          <p className="font-semibold text-sm">Manual Deposit</p>
          <input
            placeholder="User ID"
            className="border rounded px-2 py-1 text-xs"
            value={manualDeposit.userId}
            onChange={(e) =>
              setManualDeposit((f) => ({ ...f, userId: e.target.value }))
            }
          />
          <input
            placeholder="Amount (USD)"
            type="number"
            className="border rounded px-2 py-1 text-xs"
            value={manualDeposit.amount}
            onChange={(e) =>
              setManualDeposit((f) => ({ ...f, amount: e.target.value }))
            }
          />
          <button
            type="submit"
            className="bg-blue-600 text-white text-xs py-1.5 rounded"
          >
            Apply Deposit
          </button>
        </form>
      </div>

      {/* Transactions table */}
      <table className="w-full bg-white rounded shadow text-xs md:text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">User ID</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Created</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx) => (
            <tr key={tx._id}>
              <td className="p-2">{tx.userId}</td>
              <td className="p-2 capitalize">{tx.type}</td>
              <td className="p-2">{formatMoney(tx.amountCents)}</td>
              <td className="p-2 capitalize">{tx.status}</td>
              <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
              <td className="p-2 space-x-1">
                {tx.type === "withdraw" && tx.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleWithdrawalAction(tx._id, "complete")}
                      className="px-2 py-1 text-xs rounded bg-green-200"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleWithdrawalAction(tx._id, "fail")}
                      className="px-2 py-1 text-xs rounded bg-red-200"
                    >
                      Fail
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {txs.length === 0 && (
            <tr>
              <td colSpan={6} className="p-2 text-gray-500">
                No transactions found
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
              onClick={() => setPage((p) => p + 1)} // ✅ fixed here
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Pending crypto deposits */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Pending Crypto Deposits</h2>
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr>
              <th className="text-left p-1">User</th>
              <th className="text-left p-1">Amount</th>
              <th className="text-left p-1">Wallet</th>
              <th className="text-left p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCrypto.map((tx) => (
              <tr key={tx._id}>
                <td className="p-1">
                  {tx.userId?.name}
                  <br />
                  <span className="text-gray-500 text-xs">
                    {tx.userId?.email}
                  </span>
                </td>
                <td className="p-1">{formatMoney(tx.amountCents)}</td>
                <td className="p-1 text-xs">
                  {tx.meta?.walletAddress || "N/A"}
                </td>
                <td className="p-1">
                  <button
                    onClick={() => approveCrypto(tx._id)}
                    className="px-2 py-1 text-xs rounded bg-green-200"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
            {pendingCrypto.length === 0 && (
              <tr>
                <td colSpan={4} className="p-2 text-gray-500 text-center">
                  No pending crypto deposits
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
