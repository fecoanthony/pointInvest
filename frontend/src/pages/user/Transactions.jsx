import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  rejected: "bg-gray-200 text-gray-700",
};

const TYPE_LABELS = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  payout: "Payout",
  fee: "Fee",
  referral: "Referral Bonus",
  adjustment: "Adjustment",
};

const STATUS_LABELS = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  rejected: "Rejected",
};

function formatAmount(cents, currency = "USD") {
  const amount = cents / 100;
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency,
  });
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchTransactions(page, limit);
  }, [page, limit]);

  const fetchTransactions = async (page, limit) => {
    try {
      setLoading(true);
      const res = await api.get("/user/transaction", {
        params: { page, limit },
      });

      const { txs, total: totalCount } = res.data.data || {};
      setTransactions(txs || []);
      setTotal(totalCount || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (tx) => {
    setSelectedTx(tx);
  };

  const closeModal = () => setSelectedTx(null);

  if (loading) return <LoadingSpinner />;
  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const amount = tx.amountCents / 100;
            const isCredit = amount > 0;
            const netCents = tx.amountCents - (tx.feeCents || 0);

            return (
              <button
                key={tx._id}
                onClick={() => handleRowClick(tx)}
                className="w-full text-left bg-white rounded-xl shadow p-4 flex justify-between items-start hover:bg-gray-50 transition"
              >
                {/* Left side: type, date, provider, related */}
                <div>
                  <p className="font-medium">
                    {TYPE_LABELS[tx.type] || tx.type}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>

                  {/* Provider */}
                  {tx.provider && (
                    <p className="text-xs text-gray-500 mt-1">
                      Method: <span className="font-medium">{tx.provider}</span>
                    </p>
                  )}

                  {/* Related object (if any) */}
                  {tx.relatedObject?.kind && (
                    <p className="text-xs text-gray-500">
                      Related:{" "}
                      <span className="font-medium">
                        {tx.relatedObject.kind}
                      </span>
                    </p>
                  )}
                </div>

                {/* Right side: amount + status */}
                <div className="text-right space-y-1">
                  {/* Gross amount */}
                  <p
                    className={`text-sm font-semibold ${
                      isCredit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCredit ? "+" : ""}
                    {formatAmount(tx.amountCents, tx.currency)}
                  </p>

                  {/* Fee, if any */}
                  {tx.feeCents > 0 && (
                    <p className="text-xs text-gray-500">
                      Fee: {formatAmount(tx.feeCents, tx.currency)}
                    </p>
                  )}

                  {/* Net amount, if fee exists */}
                  {tx.feeCents > 0 && (
                    <p className="text-xs text-gray-700">
                      Net: {formatAmount(netCents, tx.currency)}
                    </p>
                  )}

                  {/* Status badge */}
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded ${
                      statusColors[tx.status]
                    }`}
                  >
                    {STATUS_LABELS[tx.status] || tx.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* (Optional) Simple pagination controls */}
      {total > limit && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
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

      {/* Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal tx={selectedTx} onClose={closeModal} />
      )}
    </div>
  );
}

/* ------------- Detail Modal Component ------------- */

function TransactionDetailModal({ tx, onClose }) {
  const amount = tx.amountCents / 100;
  const fee = (tx.feeCents || 0) / 100;
  const net = (tx.amountCents - (tx.feeCents || 0)) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            Close
          </button>
        </div>

        {/* Basic info */}
        <div className="space-y-2 text-sm text-gray-700">
          <DetailRow label="Type" value={TYPE_LABELS[tx.type] || tx.type} />
          <DetailRow
            label="Status"
            value={STATUS_LABELS[tx.status] || tx.status}
          />
          <DetailRow label="Currency" value={tx.currency || "USD"} />
          <DetailRow
            label="Created At"
            value={new Date(tx.createdAt).toLocaleString()}
          />
          <DetailRow
            label="Updated At"
            value={new Date(tx.updatedAt).toLocaleString()}
          />
        </div>

        <hr className="my-3" />

        {/* Amounts */}
        <div className="space-y-2 text-sm text-gray-700">
          <DetailRow
            label="Gross Amount"
            value={`${amount.toFixed(2)} ${tx.currency || "USD"}`}
          />
          <DetailRow
            label="Fee"
            value={`${fee.toFixed(2)} ${tx.currency || "USD"}`}
          />
          <DetailRow
            label="Net Amount"
            value={`${net.toFixed(2)} ${tx.currency || "USD"}`}
          />
        </div>

        <hr className="my-3" />

        {/* Provider & references */}
        <div className="space-y-2 text-sm text-gray-700">
          <DetailRow label="Provider" value={tx.provider || "N/A"} />
          <DetailRow label="Provider Tx ID" value={tx.providerTxId || "N/A"} />
          <DetailRow label="Internal ID" value={tx._id} />
        </div>

        <hr className="my-3" />

        {/* Related object */}
        <div className="space-y-2 text-sm text-gray-700">
          <DetailRow
            label="Related Kind"
            value={tx.relatedObject?.kind || "N/A"}
          />
          <DetailRow
            label="Related Item ID"
            value={tx.relatedObject?.item || "N/A"}
          />
        </div>

        <hr className="my-3" />

        {/* Meta (raw JSON) */}
        <div className="space-y-1 text-sm text-gray-700">
          <p className="font-semibold">Meta</p>
          <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">
            {JSON.stringify(tx.meta || {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}
