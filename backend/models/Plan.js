import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    rate: { type: Number, required: true }, // percent per period, e.g., 2.5
    rateUnit: {
      type: String,
      enum: ["hour", "day", "week", "month", "lifetime"],
      default: "day",
    },
    periodCount: { type: Number, default: 1 }, // how many payouts (e.g., 72 for hourly 72 hours)
    locked: { type: Boolean, default: false }, // auto-locked after first investment
    payoutFrequencySeconds: { type: Number, required: true }, // seconds between payouts
    minAmountCents: { type: Number, required: true },
    maxAmountCents: { type: Number, default: Number.MAX_SAFE_INTEGER },
    capitalBack: { type: Boolean, default: true },
    autoRenew: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

PlanSchema.index({ slug: 1 });
const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
