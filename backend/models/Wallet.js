import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    currency: { type: String, default: "USD" },
    mainBalanceCents: { type: Number, default: 0 },
    interestBalanceCents: { type: Number, default: 0 },
    reservedCents: { type: Number, default: 0 }, // funds locked for active investments
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Ensure one wallet per user per currency (create unique index)
WalletSchema.index({ userId: 1, currency: 1 }, { unique: true });

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
