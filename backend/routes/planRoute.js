import express from "express";
import {
  adminListPlans,
  getPlan,
  adminCreatePlan,
  adminTogglePlan,
  adminUpdatePlan,
} from "../controllers/admin/adminPlansController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/create-plan",
  protectroute,
  isAdmin("admin", "super_admin"),
  adminCreatePlan
);
router.get("/list-plan", adminListPlans);
router.get("/single-plan", protectroute, getPlan);
router.patch(
  "/toggle-plan/:id",
  protectroute,
  isAdmin("super_admin"),
  adminTogglePlan
);
router.put(
  "/update-plan/:id",
  isAdmin("admin", "super_admin"),
  adminUpdatePlan
);

export default router;
