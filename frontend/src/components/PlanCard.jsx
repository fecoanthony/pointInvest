import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const formatMoney = (cents) => `$${(cents / 100).toLocaleString()}`;

const formatRateUnit = (unit) => {
  if (unit === "lifetime") return "Lifetime";
  return `Every ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
};

const PlanCard = ({ plan, index, onInvest }) => {
  const featured = plan.metadata?.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -8, scale: featured ? 1.02 : 1 }}
      className={`relative rounded-2xl border p-6 bg-gradient-to-b from-slate-900/60 to-slate-950
        ${
          featured
            ? "border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.15)]"
            : "border-slate-800"
        }`}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-yellow-400">{plan.name}</h3>
        <p className="text-sm text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-white">{plan.rate}%</div>
        <span className="text-sm text-slate-400">
          {formatRateUnit(plan.rateUnit)}
        </span>
      </div>

      <ul className="space-y-3 text-sm mb-6">
        <li className="flex justify-between">
          <span className="text-slate-400">Profit</span>
          <span className="text-white">{formatRateUnit(plan.rateUnit)}</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="text-slate-400">Capital back</span>
          {plan.capitalBack ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle size={16} /> Yes
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle size={16} /> No
            </span>
          )}
        </li>

        <li className="flex justify-between">
          <span className="text-slate-400">Repeatable</span>
          <span className="text-white">{plan.periodCount} Times</span>
        </li>
      </ul>

      <div className="text-center text-yellow-400 font-medium mb-6">
        {formatMoney(plan.minAmountCents)} – {formatMoney(plan.maxAmountCents)}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onInvest(plan)}
        className="w-full rounded-md bg-yellow-500 hover:bg-yellow-400
             text-slate-900 py-3 font-semibold"
      >
        Invest Now
      </motion.button>
    </motion.div>
  );
};

export default PlanCard;
