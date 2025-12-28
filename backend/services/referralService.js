// services/referralService.js
// import Referral from "../models/Referral.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

/**
 * Commission configuration:
 * - defaultCommissionPercent: default if plan doesn't specify referral percent
 * - You can extend plans with metadata.referralPercent to have plan-specific commissions
 */
const DEFAULT_COMMISSION_PERCENT = 5; // 5% default

/**
 * calculateReferralCommission
 * - amountCents: numeric, the base amount to compute commission from (e.g., investment amount or deposit)
 * - plan: optional plan object that may include metadata.referralPercent
 */
export const calculateReferralCommission = (amountCents, plan = null) => {
  const percent =
    (plan && plan.metadata && plan.metadata.referralPercent) ||
    DEFAULT_COMMISSION_PERCENT;
  return Math.round((amountCents * percent) / 100);
};

/**
 * processReferralOnInvestment
 * - Called after an investment is created (or inside the same session as the investment creation).
 * - Accepts a mongoose session (optional). If session is provided, this function will use it to be atomic.
 *
 * Parameters:
 * - refereeId: ObjectId of the user who was referred
 * - investmentId: ObjectId of the investment (for reference)
 * - amountCents: the amount the referee invested (commission base)
 * - options: { plan, session }
 *
 * Returns: { paid: boolean, commissionCents, referralDoc, tx }
 */
export const processReferralOnInvestment = async (
  refereeId,
  investmentId,
  amountCents,
  options = {}
) => {
  const { plan = null, session = null } = options;

  // Resolve referee to get referredBy
  const referee = (await User.findById(refereeId).session)
    ? await User.findById(refereeId).session(session)
    : await User.findById(refereeId);

  if (!referee) throw new Error("Referee user not found");

  const referrerId = referee.referredBy;
  if (!referrerId) {
    return { paid: false, reason: "No referrer" };
  }

  // Try to find existing referral record
  let referral = (await Referral.findOne({ referrerId, refereeId }).session)
    ? await Referral.findOne({ referrerId, refereeId }).session(session)
    : await Referral.findOne({ referrerId, refereeId });

  // If not found, create one (but do not mark paid)
  if (!referral) {
    referral = await Referral.create(
      [
        {
          referrerId,
          refereeId,
          level: 1,
          commissionCents: 0, // will fill on pay
          paid: false,
          relatedTxId: null,
          createdAt: new Date(),
        },
      ],
      { session }
    ).then((arr) => arr[0]);
  }

  // If already paid, return idempotent response
  if (referral.paid) {
    return { paid: true, reason: "Already paid", referral };
  }

  // Calculate commission
  const commissionCents = calculateReferralCommission(amountCents, plan);

  if (commissionCents <= 0) {
    // mark as paid with zero commission to avoid paying again
    referral.commissionCents = 0;
    referral.paid = true;
    await referral.save({ session });
    return { paid: true, commissionCents: 0, referral };
  }

  // Now credit the referrer's wallet and create a transaction within session
  // We expect to be called inside an outer session (e.g., investment creation). If not, we still attempt a small session.
  let createdTx;
  if (session) {
    // we are inside caller's transaction
    const wallet = await Wallet.findOneAndUpdate(
      { userId: referrerId, currency: "USD" },
      { $inc: { mainBalanceCents: commissionCents } },
      { new: true, upsert: true, session }
    );

    const txs = await Transaction.create(
      [
        {
          userId: referrerId,
          type: "referral",
          amountCents: commissionCents,
          currency: "USD",
          status: "completed",
          meta: { refereeId, investmentId },
        },
      ],
      { session }
    );
    createdTx = txs[0];

    referral.commissionCents = commissionCents;
    referral.paid = true;
    referral.relatedTxId = createdTx._id;
    await referral.save({ session });
  } else {
    // No session provided: create a temporary session to keep atomicity for referral payout alone
    const mongoose = require("mongoose");
    const s = await mongoose.startSession();
    try {
      await s.withTransaction(async () => {
        const wallet = await Wallet.findOneAndUpdate(
          { userId: referrerId, currency: "USD" },
          { $inc: { mainBalanceCents: commissionCents } },
          { new: true, upsert: true, session: s }
        );

        const txs = await Transaction.create(
          [
            {
              userId: referrerId,
              type: "referral",
              amountCents: commissionCents,
              currency: "USD",
              status: "completed",
              meta: { refereeId, investmentId },
            },
          ],
          { session: s }
        );
        createdTx = txs[0];

        referral.commissionCents = commissionCents;
        referral.paid = true;
        referral.relatedTxId = createdTx._id;
        await referral.save({ session: s });
      });
    } finally {
      s.endSession();
    }
  }

  return { paid: true, commissionCents, referral, tx: createdTx };
};
