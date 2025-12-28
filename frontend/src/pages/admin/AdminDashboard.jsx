// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNav from "../../components/admin/AdminNav";
import AdminOverview from "./AdminOverview";
import AdminUsersPage from "./AdminUsersPage";
import AdminPlansPage from "./AdminPlansPage";
import AdminInvestmentsPage from "./AdminInvestmentsPage";
import AdminTransactionsPage from "./AdminTransactionsPage";

const STORAGE_KEY = "admin_dashboard_active";

const AdminDashboard = () => {
  const [active, setActive] = useState(
    localStorage.getItem(STORAGE_KEY) || "overview"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, active);
  }, [active]);

  const render = () => {
    switch (active) {
      case "users":
        return <AdminUsersPage />;
      case "plans":
        return <AdminPlansPage />;
      case "investments":
        return <AdminInvestmentsPage />;
      case "transactions":
        return <AdminTransactionsPage />;
      case "settings":
        return <div>Settings (coming soon)</div>;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mt-20">
      <AdminNav active={active} setActive={setActive} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 bg-gray-700 text-gray-800">
        {render()}
      </main>
    </div>
  );
};

export default AdminDashboard;
