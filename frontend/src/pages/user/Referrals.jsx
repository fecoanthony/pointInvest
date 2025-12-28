import React, { useEffect, useState } from "react";
import { getUserTransactions, getCurrentUser } from "../../services/userApi";

export default function Referrals() {
  const [refTxs, setRefTxs] = useState([]);
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    getUserTransactions("referral").then((res) => setRefTxs(res.data.data.txs));
    getCurrentUser().then((res) => setRefLink(res.data.user.referralUrl));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Referrals</h1>

      {/* Referral Link */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="font-semibold mb-2">Your referral link</p>
        <input value={refLink} readOnly className="w-full border p-2" />
      </div>

      {/* Referral Earnings */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Amount Earned</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {refTxs.map((tx) => (
            <tr key={tx._id}>
              <td>${tx.amountCents / 100}</td>
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
