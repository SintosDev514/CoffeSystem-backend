import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://root:123@cluster0.ryd49aw.mongodb.net/product?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
