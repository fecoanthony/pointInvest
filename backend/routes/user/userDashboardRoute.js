import express from "express";
import { getUserDashboardSummary } from "../../controllers/userDashboardController.js";
import { protectroute } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/dashboard-summary", protectroute, getUserDashboardSummary);

export default router;
