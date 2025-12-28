import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middlewares/protectRoute.js
export const protectroute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Account suspended" });
    }

    req.user = user; // ✅ Full, up-to-date user from DB
    next();
  } catch (error) {
    console.log("Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const isAdmin = (...allowedRoles) => {
  return (req, res, next) => {
    // check if user exists and if their role is in allowed roles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next(); // user is allowed
  };
};
