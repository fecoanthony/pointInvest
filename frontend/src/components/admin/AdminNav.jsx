// src/components/admin/AdminNav.jsx
import React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Layers,
  Settings,
} from "lucide-react";

const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "plans", label: "Plans", icon: Briefcase },
  { key: "investments", label: "Investments", icon: Layers },
  { key: "transactions", label: "Transactions", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AdminNav({ active, setActive }) {
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col">
        <div className="p-6 font-bold text-lg">Admin Panel</div>

        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-3 px-6 py-3 text-left
              ${active === key ? "bg-slate-800" : "hover:bg-slate-800"}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 text-white flex justify-around py-2 z-50">
        {items.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex flex-col items-center text-xs
              ${active === key ? "text-blue-400" : "text-gray-400"}`}
          >
            <Icon size={22} />
          </button>
        ))}
      </nav>
    </>
  );
}
