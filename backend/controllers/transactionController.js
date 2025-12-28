// controllers/transactionController.js
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import Investment from "../models/Investment.js";

/**
 * listUserTransactions - user endpoint
 * Query params: page, limit, type
 */
export const listUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "25", 10);
    const type = req.query.type || null;

    const filter = { userId };
    if (type) filter.type = type;

    const txs = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments(filter);

    return res.json({ success: true, data: { txs, page, limit, total } });
  } catch (err) {
    console.error("listUserTransactions error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * getTransactionById - user/admin (user can only access their own)
 */
export const getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).lean();
    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    // if user, verify ownership
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    if (!isAdmin) {
      if (String(tx.userId) !== String(req.user._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.json({ success: true, data: tx });
  } catch (err) {
    console.error("getTransactionById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
