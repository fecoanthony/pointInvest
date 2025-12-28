import express from "express";

import { protectroute } from "../../middlewares/protectRoute.js";
import {
  cancelInvestment,
  createInvestment,
  listUserInvestments,
} from "../../controllers/investmentController.js";

const router = express.Router();

router.post("/create-investment", protectroute, createInvestment);
router.get("/list-investment", protectroute, listUserInvestments);
router.post("/cancel-investment/:id/cancel", protectroute, cancelInvestment);

export default router;
