import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  customerId: String,
  amount: Number,
  currency: String,
  description: String,
  status: String,
  reference: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);


