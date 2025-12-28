import User from "../../models/User.js";
import Investment from "../../models/Investment.js";
import Transaction from "../../models/Transaction.js";

/**
 * ADMIN: Dashboard Summary
 * GET /admin/dashboard/summary
 */
export const getAdminDashboardSummary = async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });
    const suspendedUsers = await User.countDocuments({ active: false });
    const admins = await User.countDocuments({
      role: { $in: ["admin", "super_admin"] },
    });

    // INVESTMENTS
    const totalInvestments = await Investment.countDocuments();
    const activeInvestments = await Investment.countDocuments({
      state: "active",
    });
    const pausedInvestments = await Investment.countDocuments({
      state: "paused",
    });
    const completedInvestments = await Investment.countDocuments({
      state: "completed",
    });

    const investmentVolume = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: "$amountCents" } } },
    ]);

    // TRANSACTIONS
    const txSummary = await Transaction.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amountCents" },
        },
      },
    ]);

    // RECENT ACTIVITY
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean();

    const recentInvestments = await Investment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("planId", "name")
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role active createdAt")
      .lean();

    return res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          admins,
        },
        investments: {
          total: totalInvestments,
          active: activeInvestments,
          paused: pausedInvestments,
          completed: completedInvestments,
          volumeCents: investmentVolume[0]?.total || 0,
        },
        transactions: txSummary,
        recent: {
          transactions: recentTransactions,
          investments: recentInvestments,
          users: recentUsers,
        },
      },
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};
