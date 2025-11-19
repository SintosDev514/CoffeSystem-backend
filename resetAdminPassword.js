import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/admin.model.js";
import { connectDB } from "./config/db.js";

const resetAdminPassword = async () => {
  try {
    await connectDB();

    const admin = await Admin.findOne({ email: "brewtrack1@gmail.com" });
    if (!admin) {
      console.log("Admin not found");
      return;
    }

    const newPassword = "admin123"; // your desired new password
    const hashed = await bcrypt.hash(newPassword, 10);

    admin.password = hashed;
    await admin.save();

    console.log("✅ Password reset successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

resetAdminPassword();
