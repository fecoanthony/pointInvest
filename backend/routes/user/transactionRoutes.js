import express from "express";
import {
  listUserTransactions,
  getTransactionById,
  requestWithdrawal,
  createCryptoDeposit,
} from "../../controllers/admin/adminTransactionsController.js";
import { protectroute } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);

// user actions
router.get("/transaction", listUserTransactions);
router.get("/transaction/:id", getTransactionById);
// router.post("/withdraw", requestWithdrawal);
// router.post("/crypto-deposit", createCryptoDeposit);

export default router;
