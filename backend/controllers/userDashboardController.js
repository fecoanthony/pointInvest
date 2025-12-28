import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Investment from "../models/Investment.js";
import User from "../models/User.js";

/**
 * USER: Dashboard summary
 * GET /api/user/dashboard-summary
 */
export const getUserDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    /* ---------------- WALLET ---------------- */
    const wallet = await Wallet.findOne({
      userId,
      currency: "USD",
    }).lean();

    const mainBalance = wallet?.mainBalanceCents || 0;
    const interestBalance = wallet?.interestBalanceCents || 0;

    /* ---------------- TRANSACTIONS ---------------- */
    const transactions = await Transaction.find({ userId }).lean();

    const totalDeposit = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const totalPayout = transactions
      .filter((t) => t.type === "payout" && t.status === "completed")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const referralBonus = transactions
      .filter((t) => t.type === "referral" && t.status === "completed")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const totalTransactions = transactions.length;

    /* ---------------- INVESTMENTS ---------------- */
    const investments = await Investment.find({ userId }).lean();

    const totalInvest = investments.reduce(
      (sum, inv) => sum + inv.amountCents,
      0
    );

    // -------------------- Active Investment Plan ---------------
    const activeInvestments = await Investment.find({
      userId,
      state: "active",
    })
      .populate("planId", "name rate periodCount")
      .limit(5)
      .lean();

    /* ---------------- RECENT TRANSACTIONS ---------------- */
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    /* ---------------- USER INFO ---------------- */
    const user = await User.findById(userId).select("kycStatus referralCode");

    const referralUrl = `${process.env.FRONTEND_URL}/ref/${user.referralCode}`;

    return res.json({
      success: true,
      data: {
        balances: {
          mainBalanceCents: mainBalance,
          interestBalanceCents: interestBalance,
        },
        totals: {
          totalDepositCents: totalDeposit,
          totalInvestCents: totalInvest,
          totalPayoutCents: totalPayout,
          referralBonusCents: referralBonus,
          totalTransactions,
          totalTickets: 0, // placeholder
        },
        referral: {
          referralUrl,
        },
        kycStatus: user.kycStatus || "pending",
        recentTransactions,
        activeInvestments,
      },
    });
  } catch (err) {
    console.error("User dashboard summary error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};
