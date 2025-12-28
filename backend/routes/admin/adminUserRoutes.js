import express from "express";
import {
  adminListUsers,
  adminGetUserDetails,
  adminChangeUserRole,
  adminToggleUserSuspension,
} from "../../controllers/admin/adminUserController.js";

import { protectroute, isAdmin } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectroute, isAdmin("admin", "super_admin"), adminListUsers);
router.get(
  "/:userId",
  protectroute,
  isAdmin("admin", "super_admin"),
  adminGetUserDetails
);
router.patch(
  "/:userId/role",
  protectroute,
  isAdmin("admin", "super_admin"),
  adminChangeUserRole
);
router.patch(
  "/:userId/status",
  protectroute,
  isAdmin("admin", "super_admin"),
  adminToggleUserSuspension
);

export default router;
