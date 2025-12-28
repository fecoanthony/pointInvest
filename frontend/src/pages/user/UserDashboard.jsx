import React, { useEffect, useState } from "react";
import UserNav from "../../components/user/UserNav";

import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Withdrawals from "./Withdrawals";
import Referrals from "./Referrals";
import Investments from "./Investments";
import Profile from "./Profile";
import Deposits from "./Deposits";

const STORAGE_KEY = "user_dashboard_active";

export default function UserDashboard() {
  const [active, setActive] = useState(
    localStorage.getItem(STORAGE_KEY) || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, active);
  }, [active]);

  const render = () => {
    switch (active) {
      case "deposits":
        return <Deposits />;
      case "withdrawals":
        return <Withdrawals />;
      case "transactions":
        return <Transactions />;
      case "investments":
        return <Investments />;
      case "referrals":
        return <Referrals />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mt-20">
      <UserNav active={active} setActive={setActive} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 bg-gray-800 text-gray-400">
        {render()}
      </main>
    </div>
  );
}
