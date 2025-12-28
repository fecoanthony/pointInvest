import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    amountCents: { type: Number, required: true },
    startAt: { type: Date, required: true, default: Date.now },
    nextPayoutAt: { type: Date, required: true },
    paymentsCompleted: { type: Number, default: 0 },
    totalExpectedProfitCents: { type: Number, default: 0 },
    state: {
      type: String,
      enum: ["active", "completed", "cancelled", "paused"],
      default: "active",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

InvestmentSchema.index({ userId: 1, state: 1 });

const Investment = mongoose.model("Investment", InvestmentSchema);
export default Investment;
