import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/admin.model.js";
import { connectDB } from "./config/db.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "brewtrack1@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const password = "admin123";

    const admin = new Admin({
      email: "brewtrack1@gmail.com",
      password: password, // <-- FIXED
      role: "admin",
    });

    await admin.save();
    console.log("✅ New admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
