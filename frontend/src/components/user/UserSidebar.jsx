export default function UserSidebar({ active, setActive }) {
  const item = (key, label) => (
    <button
      onClick={() => setActive(key)}
      className={`text-left px-4 py-2 rounded ${
        active === key ? "bg-blue-600 text-white" : "hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-64 bg-white shadow p-4 flex flex-col gap-2">
      <h2 className="text-xl font-bold mb-4">User Dashboard</h2>

      {item("dashboard", "Dashboard")}
      {item("investments", "Investments")}
      {item("transactions", "Transactions")}
      {item("withdrawals", "Withdrawals")}
      {item("referrals", "Referrals")}
      {item("profile", "Profile")}
    </aside>
  );
}
