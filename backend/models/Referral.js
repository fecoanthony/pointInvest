import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  refereeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  level: { type: Number, default: 1 },
  commissionCents: { type: Number, required: true, default: 0 },
  paid: { type: Boolean, default: false },
  relatedTxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

ReferralSchema.index({ referrerId: 1, refereeId: 1 }, { unique: true });

const Referral = mongoose.model("Referral", ReferralSchema);
export default Referral;
