import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("database connected successfully");
  } catch (error) {
    console.log("error connecting to database", error);
    process.exit(1);
  }
};
