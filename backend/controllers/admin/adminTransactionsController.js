// controllers/transactionController.js
import mongoose from "mongoose";
import Transaction from "../../models/Transaction.js";
import Wallet from "../../models/Wallet.js";
import Investment from "../../models/Investment.js";

/**
 * createDeposit - ADMIN or provider webhook
 * Creates a deposit transaction and credits user's wallet in a DB transaction.
 * Body: { userId, amountCents, provider, providerTxId, currency }
 */
export const createDeposit = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      userId,
      amountCents,
      provider = "manual",
      providerTxId = null,
      currency = "USD",
    } = req.body;
    if (!userId || !amountCents || amountCents <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid deposit payload" });

    await session.withTransaction(async () => {
      // Create transaction (credit)
      await Transaction.create(
        [
          {
            userId,
            type: "deposit",
            provider,
            providerTxId,
            amountCents,
            currency,
            status: "completed",
          },
        ],
        { session }
      );

      // Credit wallet mainBalanceCents
      const wallet = await Wallet.findOneAndUpdate(
        { userId, currency },
        { $inc: { mainBalanceCents: amountCents } },
        { upsert: true, new: true, session }
      );

      // Optionally: emit event / notification
    });

    session.endSession();
    return res.json({ success: true, message: "Deposit applied" });
  } catch (err) {
    console.error("createDeposit error:", err);
    session.endSession();
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * requestWithdrawal - user endpoint
 * Creates a withdrawal transaction in 'pending' status and reduces available mainBalance (reserving funds).
 * Body: { amountCents, currency, destinationMeta }
 */
export const requestWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const { amountCents, currency = "USD", destinationMeta = {} } = req.body;
    if (!amountCents || amountCents <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ userId, currency }).session(
        session
      );
      if (!wallet || wallet.mainBalanceCents < amountCents) {
        throw new Error("Insufficient funds");
      }

      // move funds to reserved (or directly deduct depending on desired UX)
      wallet.mainBalanceCents -= amountCents;
      wallet.reservedCents += amountCents;
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            userId,
            type: "withdraw",
            amountCents: -amountCents, // debit
            currency,
            status: "pending",
            meta: { destinationMeta },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res
      .status(201)
      .json({ success: true, message: "Withdrawal requested" });
  } catch (err) {
    console.error("requestWithdrawal error:", err);
    session.endSession();
    return res
      .status(400)
      .json({ success: false, message: err.message || "Failed" });
  }
};

/**
 * processWithdrawal - ADMIN only
 * Admin marks a pending withdrawal as completed/failed. On complete: reserved->reduced and transaction updated to completed.
 * Body: { transactionId, action: "complete" | "fail", providerTxId?, feeCents? }
 */
export const processWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      transactionId,
      action,
      providerTxId = null,
      feeCents = 0,
    } = req.body;
    if (!transactionId || !["complete", "fail"].includes(action))
      return res.status(400).json({ message: "Invalid request" });

    await session.withTransaction(async () => {
      const tx = await Transaction.findById(transactionId).session(session);
      if (!tx) throw new Error("Transaction not found");
      if (tx.type !== "withdraw" || tx.status !== "pending")
        throw new Error("Transaction not pending withdraw");

      const wallet = await Wallet.findOne({
        userId: tx.userId,
        currency: tx.currency,
      }).session(session);
      if (!wallet) throw new Error("Wallet not found");

      if (action === "complete") {
        // reduce reserved (funds leave system)
        wallet.reservedCents -= Math.abs(tx.amountCents);
        if (feeCents) {
          // if you charge fee, create a fee transaction crediting platform (optional)
          tx.feeCents = feeCents;
          // You might also create a separate transaction for fee income (not shown).
        }
        await wallet.save({ session });

        tx.status = "completed";
        tx.providerTxId = providerTxId;
        await tx.save({ session });
      } else {
        // fail -> return reserved to main
        wallet.reservedCents -= Math.abs(tx.amountCents);
        wallet.mainBalanceCents += Math.abs(tx.amountCents);
        await wallet.save({ session });

        tx.status = "failed";
        tx.meta = { ...tx.meta, failureHandledAt: new Date() };
        await tx.save({ session });
      }
    });

    session.endSession();
    return res.json({ success: true, message: `Withdrawal ${action}` });
  } catch (err) {
    console.error("processWithdrawal error:", err);
    session.endSession();
    return res
      .status(400)
      .json({ success: false, message: err.message || "Failed" });
  }
};

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
 * adminListTransactions - admin endpoint
 * Query: userId, type, status, page, limit, date range
 */
export const adminListTransactions = async (req, res) => {
  try {
    const {
      userId,
      type,
      status,
      page = 1,
      limit = 50,
      startDate,
      endDate,
    } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate || endDate) filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);

    const txs = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await Transaction.countDocuments(filter);
    return res.json({
      success: true,
      data: {
        txs,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
      },
    });
  } catch (err) {
    console.error("adminListTransactions error:", err);
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

// controllers/transactionController.js
export const createCryptoDeposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: "deposit",
      provider: "crypto-manual",
      amountCents: Math.round(amount * 100),
      status: "pending",
      meta: {
        walletAddress: process.env.CRYPTO_WALLET_ADDRESS, // the address user sends to
      },
    });

    return res.status(201).json({
      success: true,
      message: "Deposit request created. Awaiting admin approval.",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPendingCryptoDeposits = async (req, res) => {
  const pending = await Transaction.find({
    type: "deposit",
    provider: "crypto-manual",
    status: "pending",
  }).populate("userId", "name email");

  return res.json({ success: true, data: pending });
};

export const approveCryptoDeposit = async (req, res) => {
  try {
    const { txId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    const tx = await Transaction.findById(txId).session(session);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    // update transaction
    tx.status = "completed";
    await tx.save({ session });

    // credit wallet
    await Wallet.findOneAndUpdate(
      { userId: tx.userId },
      { $inc: { mainBalanceCents: tx.amountCents } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, message: "Deposit approved" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
