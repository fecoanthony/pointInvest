import React, { useEffect, useState } from "react";
import { requestWithdrawal, getUserTransactions } from "../../services/userApi";

export default function Withdrawals() {
  const [amount, setAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);

  const loadWithdrawals = async () => {
    try {
      const res = await getUserTransactions({
        page: 1,
        limit: 25,
        type: "withdraw", // filter only withdraw transactions
      });

      // listUserTransactions returns { success, data: { txs, page, limit, total } }
      const { txs } = res.data.data || {};
      setWithdrawals(txs || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load withdrawals");
    }
  };

  const submit = async () => {
    if (!amount) return alert("Enter amount");
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) return alert("Enter a valid amount");

    try {
      await requestWithdrawal({ amountCents: Math.round(numeric * 100) });
      setAmount("");
      await loadWithdrawals();
    } catch (err) {
      console.error(err);
      alert("Withdrawal request failed");
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Withdrawals</h1>

      {/* Request Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Request Withdrawal
        </button>
      </div>

      {/* History */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w._id}>
              <td className="p-2">${Math.abs(w.amountCents) / 100}</td>
              <td className="p-2">{w.status}</td>
              <td className="p-2">
                {new Date(w.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {withdrawals.length === 0 && (
            <tr>
              <td colSpan={3} className="p-2 text-gray-500">
                No withdrawals yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
