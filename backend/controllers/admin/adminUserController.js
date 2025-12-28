import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import Investment from "../../models/Investment.js";
import Transaction from "../../models/Transaction.js";

/**
 * ADMIN: List all users (paginated)
 */
export const adminListUsers = async (req, res) => {
  try {
    const { page = 1, limit = 25, role, status } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: { users, total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN: Get single user full overview
 */
export const adminGetUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await Wallet.findOne({ userId });
    const investments = await Investment.find({ userId });
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        user,
        wallet,
        investmentsCount: investments.length,
        recentTransactions: transactions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN: Change user role
 * Only SUPERADMIN can do this
 */
export const adminChangeUserRole = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Super_admin only" });
    }

    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["user", "admin", "super_admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await User.findByIdAndUpdate(userId, { role });

    res.json({ success: true, message: "User role updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN: Suspend or Activate user
 */
// export const adminToggleUserStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { status } = req.body; // active | suspended

//     await User.findByIdAndUpdate(userId, { status });

//     res.json({ success: true, message: "User status updated" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/**
 * SUSPEND / UNSUSPEND USER
 */
export const adminToggleUserSuspension = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    return res.json({
      success: true,
      message: user.isSuspended ? "User suspended" : "User unsuspended",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * KYC APPROVAL / REJECTION
 */
export const updateKycStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    await User.findByIdAndUpdate(userId, { kycStatus: status });

    return res.json({ success: true, message: `KYC ${status}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
