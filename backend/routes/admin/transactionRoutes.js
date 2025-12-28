// routes/admin/transactionRoutes.js
import express from "express";
import {
  adminListTransactions,
  processWithdrawal,
  getPendingCryptoDeposits,
  approveCryptoDeposit,
  createDeposit,
  getTransactionById,
} from "../../controllers/admin/adminTransactionsController.js";
import { protectroute, isAdmin } from "../../middlewares/protectRoute.js";

const router = express.Router();

// All routes here require auth + admin
router.use(protectroute, isAdmin("admin", "super_admin"));

// Base: /api/admin/transactions
router.get("/transactions", adminListTransactions);
router.get("/transactions/:id", getTransactionById);

router.post("/transactions/deposit", createDeposit);
router.post("/transactions/withdraw/process", processWithdrawal);

router.get("/transactions/crypto/pending", getPendingCryptoDeposits);
router.post("/transactions/crypto/approve/:txId", approveCryptoDeposit);

export default router;
