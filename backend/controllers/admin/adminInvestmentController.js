import mongoose from "mongoose";
import Investment from "../../models/Investment.js";
import Wallet from "../../models/Wallet.js";
import Transaction from "../../models/Transaction.js";

// /**
//  * ADMIN: List all investments
//  */
export const adminListInvestments = async (req, res) => {
  try {
    const { state, userId, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (state) filter.state = state;
    if (userId) filter.userId = userId;

    const investments = await Investment.find(filter)
      .populate("userId", "name email")
      .populate("planId", "name rate")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Investment.countDocuments(filter);

    return res.json({
      success: true,
      data: { investments, page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    console.error("adminListInvestments error:", err); // 👈 add this
    return res.status(500).json({ message: err.message });
  }
};

// /**
//  * ADMIN: Pause or Resume investment
//  */
export const toggleInvestmentState = async (req, res) => {
  try {
    const { investmentId, action } = req.body;

    const investment = await Investment.findById(investmentId);
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (investment.state === "completed") {
      return res.status(400).json({
        message: "Completed investments are immutable",
      });
    }

    if (action === "pause") investment.state = "paused";
    if (action === "resume") investment.state = "active";

    await investment.save();

    return res.json({
      success: true,
      message: `Investment ${action}d`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// /**
//  * SUPER ADMIN: Force cancel investment
//  */
export const forceCancelInvestment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { investmentId } = req.params;

    await session.withTransaction(async () => {
      const inv = await Investment.findById(investmentId).session(session);
      if (!inv) throw new Error("Investment not found");

      if (inv.state === "completed") {
        throw new Error("Completed investments cannot be cancelled");
      }

      const wallet = await Wallet.findOne({
        userId: inv.userId,
        currency: "USD",
      }).session(session);

      if (!wallet) throw new Error("Wallet not found");

      // Refund reserved funds
      wallet.reservedCents -= inv.amountCents;
      wallet.mainBalanceCents += inv.amountCents;
      await wallet.save({ session });

      inv.state = "cancelled";
      await inv.save({ session });

      await Transaction.create(
        [
          {
            userId: inv.userId,
            type: "adjustment",
            amountCents: inv.amountCents,
            status: "completed",
            meta: {
              reason: "admin_force_cancel",
              investmentId: inv._id,
            },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res.json({
      success: true,
      message: "Investment force-cancelled",
    });
  } catch (err) {
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
};
