// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
    }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    let createdUser;
    await session.withTransaction(async () => {
      // create user and set password
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
      });
      await user.setPassword(password);

      // If referralCode provided, resolve the referring user and set referredBy before saving
      if (referralCode && typeof referralCode === "string") {
        const referringUser = await User.findOne({ referralCode }).session(
          session
        );
        if (referringUser) {
          user.referredBy = referringUser._id;
        }
      }

      // save the user (pre-save hook will generate referralCode)
      createdUser = await user.save({ session });

      // create wallet for user
      await Wallet.create(
        [{ userId: createdUser._id, currency: "USD", mainBalanceCents: 0 }],
        { session }
      );
    }); // end transaction

    session.endSession();

    // create token + cookie (same as before)
    const accessToken = jwt.sign(
      { userId: createdUser._id, role: createdUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const secureFlag = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: secureFlag,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    const payload = {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      referralCode: createdUser.referralCode,
      role: createdUser.role,
      kycStatus: createdUser.kycStatus,
      createdAt: createdUser.createdAt,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: payload,
    });
  } catch (err) {
    session.endSession();
    if (err && err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Duplicate entry — please try again" });
    }
    return next(err);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Verifies credentials, issues access & refresh tokens, and sets them as httpOnly cookies.
 * Returns basic user payload (no tokens in body).
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // Find user (case-insensitive email lookup)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Validate password using the model helper (bcrypt)
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Optionally: check if email verified or KYC required
    // if (!user.isEmailVerified) return res.status(403).json({ message: 'Email not verified' });

    // Generate tokens
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const accessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set tokens as HttpOnly cookies
    // Use secure: true in production (requires HTTPS)
    const secureFlag = process.env.NODE_ENV === "production";
    // If your frontend is on different domain and you need cross-site cookies, use sameSite: 'none' and secure: true
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: secureFlag, // ensure this is defined earlier
      sameSite: "lax", // or "none" for cross-site use
      maxAge: sevenDays, // 7 days
    });

    // Optional: include minimal wallet info in response
    // const wallet = await Wallet.findOne({ userId: user._id }).lean();

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      role: user.role,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt,
      // wallet: wallet ? { mainBalanceCents: wallet.mainBalanceCents } : undefined
    };

    return res.json({ message: "Login successful", user: payload });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    // req.user is already populated by protectroute middleware
    // No need to query DB again
    const referralUrl = `${process.env.FRONTEND_ORIGIN}/register?ref=${req.user.referralCode}`;

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        referralCode: req.user.referralCode,
        referralUrl: referralUrl,
      },
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
