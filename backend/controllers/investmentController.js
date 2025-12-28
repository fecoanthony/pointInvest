// controllers/investmentController.js
import mongoose from "mongoose";
import Investment from "../models/Investment.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Plan from "../models/Plan.js";
import { processReferralOnInvestment } from "../services/referralService.js";
import { lockPlanIfNeeded } from "./admin/adminPlansController.js";

/**
 * createInvestment - user endpoint
 * This is atomic: moves funds from mainBalance -> reserved and creates investment + transaction.
 * Body: { planId, amountCents }
 */
export const createInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const { planId, amountCents } = req.body;
    if (!planId || !amountCents)
      return res.status(400).json({ message: "Missing params" });

    const plan = await Plan.findById(planId);
    if (!plan || !plan.active)
      return res.status(400).json({ message: "Invalid plan" });

    // validate min/max
    if (amountCents < plan.minAmountCents || amountCents > plan.maxAmountCents)
      return res.status(400).json({ message: "Amount outside plan limits" });

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ userId, currency: "USD" }).session(
        session
      );
      if (!wallet || wallet.mainBalanceCents < amountCents)
        throw new Error("Insufficient funds");

      // deduct and reserve
      wallet.mainBalanceCents -= amountCents;
      wallet.reservedCents += amountCents;
      await wallet.save({ session });

      // create transaction (debit)
      await Transaction.create(
        [
          {
            userId,
            type: "adjustment",
            amountCents: -amountCents,
            currency: "USD",
            status: "completed",
            meta: {
              reason: "investment_funding",
              planId,
            },
          },
        ],
        { session }
      );

      // create Investment
      const now = new Date();
      const nextPayoutAt = new Date(
        now.getTime() + plan.payoutFrequencySeconds * 1000
      );
      const totalExpectedProfitCents = Math.round(
        (amountCents * plan.rate * plan.periodCount) / 100
      );

      const [newInv] = await Investment.create(
        [
          {
            userId,
            planId,
            amountCents,
            startAt: now,
            nextPayoutAt,
            totalExpectedProfitCents,
          },
        ],
        { session }
      );

      await lockPlanIfNeeded(planId, session);

      // Process referral payout (idempotent) inside the same session
      await processReferralOnInvestment(userId, newInv._id, amountCents, {
        plan,
        session,
      });
    }); // end withTransaction

    session.endSession();
    return res
      .status(201)
      .json({ success: true, message: "Investment created" });
  } catch (err) {
    console.error("createInvestment error:", err);
    session.endSession();
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to create investment",
    });
  }
};

/**
 * listUserInvestments - user endpoint
 */
export const listUserInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const investments = await Investment.find({ userId })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: investments });
  } catch (err) {
    console.error("listUserInvestments error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * cancelInvestment - user endpoint (if allowed by plan)
 * Refund reserved funds back to wallet and mark investment canceled. Only if no paymentsCompleted or if plan allows early cancel.
 */
export const cancelInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const investmentId = req.params.id;

    await session.withTransaction(async () => {
      const inv = await Investment.findById(investmentId).session(session);
      if (!inv) throw new Error("Investment not found");
      if (String(inv.userId) !== String(userId)) throw new Error("Forbidden");
      if (inv.state !== "active") throw new Error("Investment not active");
      // business rule: disallow cancel if paymentsCompleted > 0 (you can customize)
      if (inv.paymentsCompleted > 0)
        throw new Error("Cannot cancel after payouts started");

      // release reserved -> main
      const wallet = await Wallet.findOne({ userId, currency: "USD" }).session(
        session
      );
      if (!wallet) throw new Error("Wallet not found");

      wallet.reservedCents -= inv.amountCents;
      wallet.mainBalanceCents += inv.amountCents;
      await wallet.save({ session });

      // mark investment as cancelled
      inv.state = "cancelled";
      await inv.save({ session });

      // create transaction to document refund (credit)
      await Transaction.create(
        [
          {
            userId,
            type: "adjustment",
            amountCents: inv.amountCents,
            currency: "USD",
            status: "completed",
            meta: { reason: "investment_cancel_refund", investmentId: inv._id },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res.json({
      success: true,
      message: "Investment cancelled and funds returned",
    });
  } catch (err) {
    console.error("cancelInvestment error:", err);
    session.endSession();
    return res
      .status(400)
      .json({ success: false, message: err.message || "Failed to cancel" });
  }
};
