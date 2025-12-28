import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/database.js";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import adminDashboardRoute from "./routes/admin/adminDashboardRoute.js";
import adminInvestmentRoute from "./routes/admin/adminInvestmentRoute.js";
import userTransactionRoutes from "./routes/user/transactionRoutes.js";
import investmentRoute from "./routes/user/investmentRoute.js";
import userDashboardRoute from "./routes/user/userDashboardRoute.js";
import getUserProfileRoute from "./routes/user/getuserProfileRoute.js";
import adminTransactionRoutes from "./routes/admin/transactionRoutes.js";
import authRoute from "./routes/authRoute.js";
import planRoute from "./routes/planRoute.js";

dotenv.config();
const app = express();

const port = process.env.PORT;

// Middlewares
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // optional, for form submissions
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/user", userTransactionRoutes);
app.use("/api/admin", adminTransactionRoutes);
app.use("/api/plan", planRoute);
app.use("/api/admin", adminDashboardRoute);
app.use("/api/admin", adminInvestmentRoute);
app.use("/api/user", investmentRoute);
app.use("/api/user", userDashboardRoute);
app.use("/api", getUserProfileRoute);

app.listen(port, () => {
  console.log("server connected");
  connectDB();
});
