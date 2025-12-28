import express from "express";
import { getAdminDashboardSummary } from "../../controllers/admin/adminDashboardController.js";
import { protectroute, isAdmin } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get(
  "/dashboard/summary",
  protectroute,
  isAdmin("admin", "super_admin"),
  getAdminDashboardSummary
);

export default router;
