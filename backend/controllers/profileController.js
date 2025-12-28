import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("name email referralCode, kyStatus, createdAt")
      .lean();

    const wallet = await Wallet.findOne({ userId, currency: "USD" }).lean();

    return res.status(200).json({
      success: true,
      user,
      wallet,
    });
  } catch (error) {
    console.log("Profile Error");
    res.status(500).json({ message: "failed to Load profile" });
  }
};
