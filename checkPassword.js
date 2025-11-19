import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/admin.model.js";
import { connectDB } from "./config/db.js";

const test = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Find the admin
    const admin = await Admin.findOne({
      email: "brewtrack1@gmail.com",
    });

    if (!admin) {
      console.log("Admin not found");
      return;
    }

    // Compare with the actual current password in DB
    const currentPassword = "admin123"; // <-- set this to the current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    console.log("Password match?", isMatch); // should print true if it matches
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

test();
