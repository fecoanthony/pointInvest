import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useInvestmentStore } from "../stores/useInvestmentStore";

const centsToDollars = (cents) => cents / 100;

const InvestModal = ({ open, plan, onClose }) => {
  const [amount, setAmount] = useState("");
  const { investInPlan, loading } = useInvestmentStore();

  if (!open || !plan) return null;

  const min = centsToDollars(plan.minAmountCents);
  const max = centsToDollars(plan.maxAmountCents);

  const handleSubmit = async () => {
    const value = Number(amount);

    // 1. Empty / NaN
    if (!value || Number.isNaN(value)) {
      toast.error("Please enter a valid amount");
      return;
    }

    // 2. Range validation
    if (value < min || value > max) {
      toast.error(
        `Amount must be between $${min.toLocaleString()} and $${max.toLocaleString()}`
      );
      return;
    }

    try {
      await investInPlan({
        planId: plan._id,
        amountCents: Math.round(value * 100),
      });

      toast.success("Investment successful");
      onClose();
      setAmount("");
    } catch (err) {
      // Error toast already handled in store
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-full max-w-md rounded-xl bg-slate-900 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">
                Invest in {plan.name}
              </h3>
              <button onClick={onClose}>
                <X className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              <input
                type="number"
                min={min}
                max={max}
                placeholder={`$${min.toLocaleString()} - $${max.toLocaleString()}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full rounded-md bg-slate-800 border border-slate-700
                           px-4 py-3 text-white outline-none"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-md bg-yellow-500 hover:bg-yellow-400
                           text-slate-900 py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Processing..." : "Confirm Investment"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InvestModal;
