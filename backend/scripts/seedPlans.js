// scripts/seedPlans.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/database.js";
import Plan from "../models/Plan.js";
import { plansSeedData } from "../seed/plansSeedData.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    // Optional: clear existing plans (be careful in prod)
    // await Plan.deleteMany({});

    await Plan.insertMany(plansSeedData);

    console.log("✅ Plans seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding plans:", err);
    process.exit(1);
  }
};

run();
