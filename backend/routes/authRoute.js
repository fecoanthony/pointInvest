import express from "express";
import {
  login,
  logout,
  register,
  getCurrentUser,
} from "../controllers/authController.js";
import { protectroute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectroute, getCurrentUser);

export default router;
