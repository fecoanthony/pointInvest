// src/pages/admin/AdminPlansPage.jsx
import React, { useEffect, useState } from "react";
import {
  adminListPlans,
  adminCreatePlan,
  adminTogglePlan,
} from "../../services/adminApi";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    rate: "",
    rateUnit: "month",
    minAmountCents: "",
    maxAmountCents: "",
    periodCount: "",
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await adminListPlans();
      setPlans(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        rate: Number(form.rate),
        minAmountCents: Math.round(Number(form.minAmountCents) * 100),
        maxAmountCents: Math.round(Number(form.maxAmountCents) * 100),
        periodCount: Number(form.periodCount),
      };
      await adminCreatePlan(payload);
      toast.success("Plan created");
      setForm({
        name: "",
        description: "",
        rate: "",
        rateUnit: "month",
        minAmountCents: "",
        maxAmountCents: "",
        periodCount: "",
      });
      loadPlans();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create plan");
    }
  };

  const toggleActive = async (id) => {
    try {
      await adminTogglePlan(id);
      toast.success("Plan status changed");
      loadPlans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle plan");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">Plans</h1>

      {/* Create Plan Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl shadow p-4 space-y-3 text-sm max-w-md"
      >
        <h2 className="font-semibold mb-2">Create New Plan</h2>
        <input
          placeholder="Name"
          className="w-full border rounded px-2 py-1"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          className="w-full border rounded px-2 py-1"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input
          placeholder="Rate (%)"
          type="number"
          className="w-full border rounded px-2 py-1"
          value={form.rate}
          onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
        />
        <select
          className="w-full border rounded px-2 py-1"
          value={form.rateUnit}
          onChange={(e) => setForm((f) => ({ ...f, rateUnit: e.target.value }))}
        >
          <option value="day">Per Day</option>
          <option value="week">Per Week</option>
          <option value="month">Per Month</option>
          <option value="lifetime">Lifetime</option>
        </select>
        <input
          placeholder="Min amount (USD)"
          type="number"
          className="w-full border rounded px-2 py-1"
          value={form.minAmountCents}
          onChange={(e) =>
            setForm((f) => ({ ...f, minAmountCents: e.target.value }))
          }
        />
        <input
          placeholder="Max amount (USD)"
          type="number"
          className="w-full border rounded px-2 py-1"
          value={form.maxAmountCents}
          onChange={(e) =>
            setForm((f) => ({ ...f, maxAmountCents: e.target.value }))
          }
        />
        <input
          placeholder="Period count"
          type="number"
          className="w-full border rounded px-2 py-1"
          value={form.periodCount}
          onChange={(e) =>
            setForm((f) => ({ ...f, periodCount: e.target.value }))
          }
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-1.5 rounded"
        >
          Create Plan
        </button>
      </form>

      {/* List Plans */}
      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Rate</th>
            <th className="text-left p-2">Range</th>
            <th className="text-left p-2">Active</th>
            <th className="text-left p-2">Locked</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p._id}>
              <td className="p-2">{p.name}</td>
              <td className="p-2">
                {p.rate}% {p.rateUnit}
              </td>
              <td className="p-2">
                ${(p.minAmountCents / 100).toFixed(2)} –{" "}
                {(p.maxAmountCents / 100).toFixed(2)}
              </td>
              <td className="p-2">{p.active ? "Yes" : "No"}</td>
              <td className="p-2">{p.locked ? "Yes" : "No"}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleActive(p._id)}
                  className="px-2 py-1 text-xs rounded bg-gray-200"
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
          {plans.length === 0 && (
            <tr>
              <td colSpan={6} className="p-2 text-gray-500">
                No plans found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
