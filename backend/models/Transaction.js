import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "payout", "fee", "referral", "adjustment"],
      required: true,
    },
    provider: { type: String, default: null }, // e.g. 'stripe','coinbase','manual'
    providerTxId: { type: String, default: null },
    amountCents: { type: Number, required: true }, // positive for credit to user, negative for debit
    currency: { type: String, default: "USD" },
    feeCents: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "rejected"],
      default: "pending",
      index: true,
    },
    relatedObject: {
      // generic reference (investment, withdrawal request etc)
      kind: { type: String, default: null },
      item: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, type: 1, createdAt: -1 });

const Transaction = mongoose.model("transaction", TransactionSchema);
export default Transaction;
