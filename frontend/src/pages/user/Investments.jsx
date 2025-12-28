import React, { useEffect, useState } from "react";
import { getUserInvestments } from "../../services/userApi";

export default function Investments() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    getUserInvestments().then((res) => setInvestments(res.data.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Investments</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.planId?.name}</td>
              <td>${inv.amountCents / 100}</td>
              <td>{inv.state}</td>
              <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
