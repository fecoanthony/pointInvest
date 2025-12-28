import React from "react";
export default function Dashboard() {
  const stats = [
    { label: "Balance", value: "$12,450" },
    { label: "Active Investment", value: "$8,000" },
    { label: "Referral Earnings", value: "$520" },
    { label: "Withdrawals", value: "$1,200" },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Welcome back 👋</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-lg md:text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
