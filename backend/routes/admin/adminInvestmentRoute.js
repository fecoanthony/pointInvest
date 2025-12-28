import express from "express";
import {
  adminListInvestments,
  toggleInvestmentState,
  forceCancelInvestment,
} from "../../controllers/admin/adminInvestmentController.js";

import { protectroute, isAdmin } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);

// // Admin & Super Admin
router.get(
  "/investments",
  isAdmin("admin", "super_admin"),
  adminListInvestments
);

router.patch(
  "/investments/state",
  isAdmin("admin", "super_admin"),
  toggleInvestmentState
);

// // Super Admin only
router.patch(
  "/investments/:investmentId/force-cancel",
  isAdmin("super_admin"),
  forceCancelInvestment
);

export default router;
