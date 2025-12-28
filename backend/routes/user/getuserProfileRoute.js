import express from "express";
import { protectroute } from "../../middlewares/protectRoute.js";
import { getUserProfile } from "../../controllers/profileController.js";

const router = express.Router();

router.get("/profile", protectroute, getUserProfile);

export default router;
