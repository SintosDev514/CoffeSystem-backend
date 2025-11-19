import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Mongo URL:", process.env.MONGO_URL);

    // Try connecting
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      family: 4, // force IPv4 to avoid DNS/IPv6 issues
      serverSelectionTimeoutMS: 5000, // timeout after 5s instead of hanging forever
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
